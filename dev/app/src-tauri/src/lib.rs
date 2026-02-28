// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use serde::Serialize;
use tauri::{AppHandle, Emitter};

#[derive(Serialize, Clone)]
pub struct BidsStatePayload {
    pub time_ms: i32,
    pub location_m: f64,
}

pub fn start_bids_polling(app: AppHandle) {
    std::thread::spawn(move || {
        let smem = match bids_smemlib::SMemLib::new() {
            Ok(s) => s,
            Err(_) => return,
        };
        loop {
            if let Ok(bsmd) = smem.read_bsmd() {
                if bsmd.is_enabled() {
                    let payload = BidsStatePayload {
                        time_ms: bsmd.state_data.t,
                        location_m: bsmd.state_data.z,
                    };
                    let _ = app.emit("bids-state", payload);
                }
            }
            std::thread::sleep(std::time::Duration::from_millis(500));
        }
    });
}
