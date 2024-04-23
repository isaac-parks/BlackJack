use std::io::{prelude::*, BufReader};
use std::net::{TcpListener, TcpStream};
use std::collections::HashMap;

use std::fs::read;
use std::io::Read;

use crate::controller::controller;

use sha1::{Sha1, Digest};

 #[derive(Debug)]
pub enum RequestType {
    Http,
    WebSocket
}

#[derive(Debug)]
pub struct Request {
    pub _type: RequestType,
    pub headers: HashMap<String, String>,
    pub body: String
}

impl Request {
    fn new_from_stream(stream: &TcpStream) -> Self {
        let mut buf_r = BufReader::new(stream);
        let mut data_itr = buf_r.by_ref().lines().map(|result| result.unwrap());

        let mut headers: HashMap<String, String> = HashMap::new();
        let mut body = String::new();
        let mut request_type: RequestType = RequestType::Http;

        if let Some(req_line) = data_itr.next() {
            headers.insert(String::from("RequestLine"), req_line);
        }

        let mut content_length = 0;

        while let Some(s) = data_itr.next() {
            if s.is_empty() {
                break;
            }

            let mut parts = s.splitn(2, ':');
            if let Some(key) = parts.next() {
                let value = parts.next().unwrap_or("").trim().to_string();
                if key.trim().eq_ignore_ascii_case("Content-Length") {
                    content_length = value.parse::<usize>().unwrap_or(0);
                }

                if key.trim().to_ascii_lowercase().contains("websocket") {
                    request_type = RequestType::WebSocket;
                }
                headers.insert(key.trim().to_string(), value);
            }
        }

        if content_length > 0 {
            let mut body_buffer = vec![0; content_length];
            buf_r.read_exact(&mut body_buffer).expect("Couldn't read body");
            body = String::from_utf8(body_buffer).expect("Couldn't decode body");
        }

        Request {
            _type: request_type,
            headers: headers,
            body: body,
        }
    }
}

fn run_server(listener: TcpListener) {
    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        if let Some(request) = handle_connection(&stream) {
            controller(request);
            // let html = read("C:\\Users\\Isaac\\Desktop\\code\\projects\\BlackJack\\backend\\src\\copy.html").unwrap();
            let response = "HTTP/1.1 200 OK\r\n\r\n";
            stream.write_all(response.as_bytes()).unwrap();
            // stream.write_all(&html).unwrap();
            if let Err(_) = stream.flush() {
                println!("Error occured sending response.");
                break;
            }
        }
    }
}

fn handle_connection(stream: &TcpStream) -> Option<Request> {
    let r = Request::new_from_stream(&stream);
    Some(r)
}

pub fn init() {
    let port: &str = "1818";
    let host: &str = "127.0.0.1";
    let hn: &str = &format!("{}:{}", &host, &port);

    let listener = TcpListener::bind(&hn).unwrap();
    println!("Started on {}:{}", host, port);
    run_server(listener);
}
