import { Playground } from "@/components/playground";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Playground />
      <footer className="mt-auto border-t py-4">
        <p className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          A single-user playground inspired by{" "}
          <a
            href="https://github.com/github/spec-kit"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2 hover:text-foreground"
          >
            GitHub Spec Kit
          </a>
          . No CLI, no LLM — just the Spec-Driven workflow and exportable markdown.
        </p>
      </footer>
    </main>
  );
}
