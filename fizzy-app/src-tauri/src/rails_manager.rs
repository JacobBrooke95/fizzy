use std::process::Stdio;
use std::sync::atomic::{AtomicU32, Ordering};
use std::time::Duration;
use tokio::process::Command;
use tokio::time::sleep;

const FIZZY_DIR: &str = "/Users/jacobbrooke/Projects/fizzy";
const RAILS_PORT: u16 = 3006;
const HEALTH_CHECK_URL: &str = "http://fizzy.localhost:3006/up";
const MAX_STARTUP_WAIT: Duration = Duration::from_secs(60);
const HEALTH_CHECK_INTERVAL: Duration = Duration::from_millis(500);

pub struct RailsManager {
    pid: AtomicU32,
}

impl RailsManager {
    pub fn new() -> Self {
        Self {
            pid: AtomicU32::new(0),
        }
    }

    pub async fn start(&self) -> Result<(), String> {
        println!("Starting Rails server...");

        // Start Rails server using mise exec (full path for GUI apps)
        // Set SOLID_QUEUE_IN_PUMA=false to prevent Solid Queue from crashing the server
        let child = Command::new("/opt/homebrew/bin/mise")
            .args(["exec", "--", "bin/rails", "server", "-p", &RAILS_PORT.to_string()])
            .env("SOLID_QUEUE_IN_PUMA", "false")
            .current_dir(FIZZY_DIR)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn Rails process: {}", e))?;

        let pid = child.id().unwrap_or(0);
        self.pid.store(pid, Ordering::SeqCst);
        println!("Rails process started with PID: {}", pid);

        // Wait for server to be ready
        self.wait_for_ready().await?;

        Ok(())
    }

    async fn wait_for_ready(&self) -> Result<(), String> {
        println!("Waiting for Rails server to be ready...");

        let start = std::time::Instant::now();

        while start.elapsed() < MAX_STARTUP_WAIT {
            if self.health_check().await {
                println!("Rails server is ready!");
                return Ok(());
            }
            sleep(HEALTH_CHECK_INTERVAL).await;
        }

        Err("Rails server failed to start within timeout".to_string())
    }

    async fn health_check(&self) -> bool {
        match reqwest::get(HEALTH_CHECK_URL).await {
            Ok(response) => response.status().is_success(),
            Err(_) => false,
        }
    }

    pub async fn stop(&self) {
        let pid = self.pid.load(Ordering::SeqCst);
        if pid > 0 {
            println!("Stopping Rails server (PID: {})...", pid);

            // Send SIGTERM to gracefully stop Puma
            #[cfg(unix)]
            {
                use std::process::Command as StdCommand;
                let _ = StdCommand::new("kill")
                    .args(["-TERM", &pid.to_string()])
                    .status();
            }

            // Wait a moment for graceful shutdown
            sleep(Duration::from_secs(2)).await;

            // Force kill if still running
            #[cfg(unix)]
            {
                use std::process::Command as StdCommand;
                let _ = StdCommand::new("kill")
                    .args(["-9", &pid.to_string()])
                    .status();
            }

            self.pid.store(0, Ordering::SeqCst);
            println!("Rails server stopped");
        }
    }
}

impl Drop for RailsManager {
    fn drop(&mut self) {
        let pid = self.pid.load(Ordering::SeqCst);
        if pid > 0 {
            #[cfg(unix)]
            {
                use std::process::Command as StdCommand;
                let _ = StdCommand::new("kill")
                    .args(["-TERM", &pid.to_string()])
                    .status();
            }
        }
    }
}
