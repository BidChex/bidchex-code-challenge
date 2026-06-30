# How to export your AI chat

Drop at least one full transcript into `ai-logs/exports/`. Markdown, text, or JSON is perfect.
Pick the tool you used:

## Claude Code (CLI)
- Run `/export` inside your session. Bare `/export` opens a menu (copy to clipboard or save to
  file); `/export my-session` writes directly. Output is a rendered **plain-text** transcript
  (messages + tool output), saved to your **current working directory**. Move it into
  `ai-logs/exports/`.
- The raw session transcript is also stored as JSONL at
  `~/.claude/projects/<sanitized-project-path>/<session-id>.jsonl` (the folder name is your
  project path with non-alphanumeric characters replaced by `-`, not a real hash). The JSONL
  format is internal and may change between versions, so prefer `/export` for a stable file.

## Cursor
- Cursor has **no built-in "Export Chat"** yet, so use the **SpecStory** extension: install it
  **from inside Cursor's own Extensions panel** (not the VS Code Marketplace). It auto-saves
  every chat as Markdown into `.specstory/history/` in your repo. You can also run
  `SpecStory: Save AI Chat History` from the Command Palette.
- Then copy the relevant file from `.specstory/history/` into `ai-logs/exports/`.
- Fallback: select the conversation in the chat pane and copy/paste it into a `.md` file here.

## GitHub Copilot Chat (VS Code)
- Built-in: open the chat session and run **`Chat: Export Chat...`** from the Command Palette
  (Ctrl/Cmd+Shift+P). It writes a **JSON** file of all prompts and responses. Put it in
  `ai-logs/exports/`.
- Or use **SpecStory** (also supports Copilot in VS Code): auto-saves to `.specstory/history/`
  as Markdown.

## ChatGPT (web)
- **Share** icon at the top of the conversation → Copy Link (a read-only public view). Include
  the link **and** a copy of the text in a `.md` file here (links can rot).
- Or Settings → Data Controls → **Export data**: you get an email with a download link to a ZIP
  containing `conversations.json` and a viewable `chat.html`. (Note: Team/Enterprise workspace
  chats cannot be exported this way, only personal chats.)

## Claude.ai (web)
- **Share** control on the chat creates a shareable link. Include the link **and** the copied
  text in a `.md` file here.
- There is **no official single-conversation file export**. The account-wide export lives at
  Settings → **Privacy → Export Data** (emailed JSON archive). For one chat, copy/paste, use the
  browser's Print → Save as PDF, or a third-party exporter extension.

## Anything else
- Whatever tool you use, give us the **full transcript**, not a summary. If it can only copy to
  the clipboard, paste it into `ai-logs/exports/chat-1.md`.

> Tip: name files so the order is clear, e.g. `01-planning.md`, `02-fee-engine.md`.
