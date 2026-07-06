export function ThemeScript() {
  const code = `
    (() => {
      const saved = localStorage.getItem("adlinkly-theme") || "system";
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", saved === "dark" || (saved === "system" && prefersDark));
      document.documentElement.dataset.theme = saved;
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
