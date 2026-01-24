#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod rails_manager;

use rails_manager::RailsManager;
use std::sync::Arc;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Start Rails server in background
            let rails_manager = Arc::new(RailsManager::new());
            let manager_clone = rails_manager.clone();
            let app_handle = app.handle().clone();

            tauri::async_runtime::spawn(async move {
                match manager_clone.start().await {
                    Ok(()) => {
                        println!("Rails server started successfully");

                        // Navigate the main window to Rails server
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let url = "http://fizzy.localhost:3006".parse().unwrap();
                            if let Err(e) = window.navigate(url) {
                                eprintln!("Failed to navigate to Rails: {}", e);
                            } else {
                                println!("Navigated to Rails server");
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("Failed to start Rails server: {}", e);
                    }
                }
            });

            // Store manager in app state for cleanup
            app.manage(rails_manager);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                // Gracefully shutdown Rails on window close
                let app = window.app_handle();
                if let Some(manager) = app.try_state::<Arc<RailsManager>>() {
                    let manager = manager.inner().clone();
                    tauri::async_runtime::spawn(async move {
                        manager.stop().await;
                    });
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
