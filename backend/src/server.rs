use std::io::{prelude::*, BufReader};
use std::net::{TcpListener, TcpStream};
use std::collections::HashMap;
 #[derive(Debug)]
enum RequestType {
    Http,
    WebSocket
}

#[derive(Debug)]
struct Request {
    rtype: RequestType,
    headers: HashMap<String, String>,
    body: Vec<String>
}

impl Request {
    fn new_from_stream(mut stream: TcpStream) -> Self {
        let buf_r = BufReader::new(&mut stream);
        let mut data_itr = buf_r.lines().map(|result| result.unwrap());

        let mut headers: HashMap<String, String> = HashMap::new();
        let mut body: Vec<String> = Vec::new();

        let mut parsing_headers = true;
        let mut r_type: RequestType = RequestType::Http;

        let mut req_line = data_itr.next();
        headers.insert(
            String::from("RequestLine"),
            req_line.unwrap()
        );

        while let Some(s) = data_itr.next() {
            if s.is_empty() {
                parsing_headers = false;
            }
            if s.to_lowercase().contains("websocket") {
                r_type = RequestType::WebSocket;
            }
            if parsing_headers {
                let mut split = s.split(":");
                headers.insert(
                    split.next().unwrap().to_string(),
                    match split.next() {
                        Some(s) => s.to_string(),
                        None => String::new()
                    }
                );
            }
            else {
                body.push(s);
            }
        }
        Request {
            rtype: r_type,
            headers: headers,
            body: body
        }
    }

    fn body_to_json() {
        todo!()
    }
}

pub fn init() {
    let port: &str = "1818"; // hardcoding for now
    let host: &str = "127.0.0.1";
    let hn: &str = &format!("{}:{}", &host, &port);


    println!("Starting server on port {}", &hn);
    let listener = TcpListener::bind(&hn).unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();
        println!("Received Communication...");
        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let r = Request::new_from_stream(stream);
    println!("{:?}", r);
}