# Fizzy Mac App

A native Mac application wrapper for Fizzy using Tauri.

## Prerequisites

- Rust toolchain (install via https://rustup.rs)
- Tauri CLI: `cargo install tauri-cli`
- mise (for Ruby version management)

## Development

```bash
cd fizzy-app

# Run in development mode
cargo tauri dev

# Build for production
cargo tauri build
```

## How it Works

1. **App Launch**: When you launch Fizzy.app, it shows a loading screen
2. **Server Start**: The app spawns the Rails server using `mise exec -- bin/rails server`
3. **Health Check**: It polls `http://fizzy.localhost:3006/up` until the server is ready
4. **WebView**: Once ready, the native WebKit window navigates to Fizzy
5. **Shutdown**: When you quit the app, it sends SIGTERM to gracefully stop Puma

## Configuration

The app expects Fizzy to be at `/Users/jacobbrooke/Projects/fizzy`. To change this, edit `src-tauri/src/rails_manager.rs`:

```rust
const FIZZY_DIR: &str = "/path/to/your/fizzy";
```

## Building a Release

```bash
cargo tauri build
```

This creates:
- `target/release/bundle/macos/Fizzy.app` - The Mac application
- `target/release/bundle/dmg/Fizzy_*.dmg` - Installer disk image

## Notes

- The app uses Tauri 2.x with native WebKit (not Chromium)
- Bundle size is ~10MB vs 150MB+ for Electron
- The Rails server runs on port 3006
- SQLite database is at `/Users/jacobbrooke/Projects/fizzy/storage/development.sqlite3`
