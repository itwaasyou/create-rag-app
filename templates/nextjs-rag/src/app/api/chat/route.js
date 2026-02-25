import { getLLM, getEmbeddings } from "@/lib/llm";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

export async function POST(req) {
    try {
        const body = await req.json();
        const message = body?.message;

        if (!message || typeof message !== "string") {
            return Response.json(
                { error: "Invalid request. 'message' must be a string." },
                { status: 400 }
            );
        }

        let vectorStore;
        const embeddings = getEmbeddings();

        if (process.env.VECTOR_DB === "supabase") {
            const { SupabaseVectorStore } = await import("@langchain/community/vectorstores/supabase");
            const { createClient } = await import("@supabase/supabase-js");
            const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PRIVATE_KEY);

            vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
                client,
                tableName: "documents",
                queryName: "match_documents",
            });
        } else {
            const { Chroma } = await import("@langchain/community/vectorstores/chroma");
            vectorStore = await Chroma.fromExistingCollection(embeddings, {
                collectionName: process.env.COLLECTION_NAME || "rag-docs",
                url: process.env.CHROMA_URL || "http://localhost:8000"
            });
        }

        const retriever = vectorStore.asRetriever();
        const llm = getLLM();

        const template = `
Answer the question based only on the following context:

{context}

Question: {question}
`;

        const prompt = PromptTemplate.fromTemplate(template);

        // Create an LCEL chain: Retriever -> Prompt -> LLM -> OutputParser
        const chain = RunnableSequence.from([
            {
                context: retriever.pipe((docs) => docs.map((d) => d.pageContent).join("\n\n")),
                question: new RunnablePassthrough()
            },
            prompt,
            llm,
            new StringOutputParser()
        ]);

        const stream = await chain.stream(message);

        const textEncoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    controller.enqueue(textEncoder.encode(chunk));
                }
                controller.close();
            }
        });

        return new Response(readable, {
            headers: { "Content-Type": "text/plain" },
        });
    } catch (error) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
