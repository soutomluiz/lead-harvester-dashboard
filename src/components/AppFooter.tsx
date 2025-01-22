export function AppFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-2">
      <div className="flex justify-end">
        <span className="text-sm text-muted-foreground">
          Developed by{" "}
          <a
            href="https://abbacreator.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:text-primary transition-colors"
          >
            Abba Creator
          </a>
        </span>
      </div>
    </footer>
  );
}