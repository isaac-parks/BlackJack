use std::io::{prelude::*, BufReader};
use std::net::{TcpListener, TcpStream};
use std::collections::HashMap;

use std::fs::read;
use std::io::Read;

 #[derive(Debug)]
enum RequestType {
    Http,
    WebSocket
}

#[derive(Debug)]
struct Request {
    rtype: RequestType,
    headers: HashMap<String, String>,
    body: String
}

impl Request {
    fn new_from_stream(stream: &TcpStream) -> Self {
        let mut buf_r = BufReader::new(stream);
        let mut data_itr = buf_r.by_ref().lines().map(|result| result.unwrap());

        let mut headers: HashMap<String, String> = HashMap::new();
        let mut body = String::new();

        if let Some(req_line) = data_itr.next() {
            headers.insert(String::from("RequestLine"), req_line);
        }

        let mut content_length = 0;

        for line in data_itr {
            let s = line;
            if s.is_empty() {
                break;
            }

            let mut parts = s.splitn(2, ':');
            if let Some(key) = parts.next() {
                let value = parts.next().unwrap_or("").trim().to_string();
                if key.trim().eq_ignore_ascii_case("Content-Length") {
                    content_length = value.parse::<usize>().unwrap_or(0);
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
            rtype: RequestType::Http,
            headers: headers,
            body: body,
        }
    }
}

fn run_server(listener: TcpListener) {
    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        if let Some(request) = handle_connection(&stream) {
            println!("{:?}", request);
            let html = read("C:\\Users\\Isaac\\Desktop\\code\\projects\\BlackJack\\backend\\src\\copy.html").unwrap();

            let response = "HTTP/1.1 200 OK\r\n\r\n";
        
            stream.write_all(response.as_bytes()).unwrap();
            stream.write_all(&html).unwrap();
            if let Err(_) = stream.flush() {
                println!("Error occured sending response.");
                break;
            }
        }
    }
}

fn handle_connection(stream: &TcpStream) -> Option<Request> {
    let r = Request::new_from_stream(&stream);
    println!("{:?}", r);
    Some(r)
}

pub fn init() {
    let port: &str = "1818"; // hardcoding for now
    let host: &str = "127.0.0.1";
    let hn: &str = &format!("{}:{}", &host, &port);


    println!("Starting server on port {}", &hn);
    let listener = TcpListener::bind(&hn).unwrap();
    run_server(listener);
}
