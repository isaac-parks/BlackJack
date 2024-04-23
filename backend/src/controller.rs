use std::collections::HashMap;

use crate::server::{Request, RequestType};

mod http;
mod websocket;


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
                println!("Hello WebSocket!");
                return true;
            }
        }
        false
    }
}

impl Controller for HttpController {
    fn create_response(&self) -> Response {
        let websocket_key = String::from("258EAFA5-E914-47DA-95CA-C5AB0DC85B1");
        let mut client_key = self.request.headers.get("Sec-WebSocket-Key").unwrap().clone(); //TODO
        let resp_key = client_key.push_str(&websocket_key); //TODO 
        let mut resp_headers: HashMap<String, String> = HashMap::new();
        resp_headers.insert("StatusLine".to_string(), "HTTP/1.1 101 OK".to_string());
        resp_headers.insert("Upgrade".to_string(), "websocket".to_string());
        resp_headers.insert("Sec-WebSocket-Accept".to_string(), "websocket".to_string());
        
        Response::new()
    }
}

impl Controller for WebSocketController{
    fn create_response(&self) -> Response {
        if self.check_handshake() {
            
        }
        Response::new()
    }
}

pub struct Response {
    pub headers: HashMap<String, String>,
    pub body: String
}

impl Response {
    fn new() -> Self {
        Response {
            headers: HashMap::new(),
            body: String::new()
        }
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
