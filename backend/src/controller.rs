use std::collections::HashMap;

use crate::shared::{Request, RequestType, Response};

mod http;
mod websocket;

use sha1::{Sha1, Digest};
use base64;


trait Controller {
    fn create_response(&self) -> Response;
}
struct HttpController {
    request: Request
}
struct WebSocketController {
    request: Request
}

impl WebSocketController {
    fn check_handshake(&self) -> bool {
        let request_line = self.request.headers.get("RequestLine");
        let upgrade_header = self.request.headers.get("Upgrade");
        if let Some(h) = upgrade_header {
            if h == "websocket" && request_line.unwrap_or(&String::new()).contains("GET") {
                return true;
            }
        }
        false
    }

    fn do_handshake(&self) -> Response {
        let mut resp_headers: HashMap<String, String> = HashMap::new();

        let client_key = self.request.headers.get("Sec-WebSocket-Key").unwrap().clone(); // TODO
        let resp_key = self.make_hs_key(&client_key);

        resp_headers.insert("StatusLine".to_string(), "HTTP/1.1 101 Switching Protocols".to_string());
        resp_headers.insert("Upgrade".to_string(), "websocket".to_string());
        resp_headers.insert("Connection".to_string(), "Upgrade".to_string());
        resp_headers.insert("Sec-WebSocket-Accept".to_string(), resp_key);
        
        let resp = Response::new_no_body(resp_headers);

        resp
    }

    fn make_hs_key(&self, request_key: &String) -> String {
        let websocket_key: String = String::from("258EAFA5-E914-47DA-95CA-C5AB0DC85B11"); // Default websocket key
        let mut client_key: String = request_key.clone();
        client_key.push_str(&websocket_key); // Concat the websocket key onto the key sent from client

        let mut hasher = Sha1::new(); // Create Sha1 hash of the concat key
        hasher.update(client_key.as_bytes());
        let hashed_key = hasher.finalize();

        let base64_key: String = base64::encode(hashed_key); // Finalize key with base64

        base64_key
    }
}

impl Controller for HttpController {
    fn create_response(&self) -> Response {
        Response::new()
    }
}

impl Controller for WebSocketController{
    fn create_response(&self) -> Response {
        if self.check_handshake() {
            return self.do_handshake();
        }
        Response::new()
    }
}


pub fn controller(request: Request) -> Response {
    println!("{:?}", &request);
    let c = make_controller(request);
    c.create_response()
}

fn make_controller(request: Request) -> Box<dyn Controller> {
    match request._type {
        RequestType::Http => Box::new(HttpController {request}),
        RequestType::WebSocket => Box::new(WebSocketController {request}),
    }
}
