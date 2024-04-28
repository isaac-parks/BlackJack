use std::io::{prelude::*, BufReader};
use std::net::{TcpListener, TcpStream};


use crate::controller::controller;
use crate::shared::{Request, Response};

fn run_server(listener: TcpListener) {
    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        if let Some(request) = handle_connection(&stream) {
            let response: Response = controller(request);
            let header_str = response.headers_to_string();
            dbg!(&header_str);
            stream.write_all(header_str.as_bytes()).unwrap();
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


// Test for response 
            // let html = read("C:\\Users\\Isaac\\Desktop\\code\\projects\\BlackJack\\backend\\src\\copy.html").unwrap();
            // let response = "HTTP/1.1 200 OK\r\n\r\n";
            // stream.write_all(response.as_bytes()).unwrap();
            // // stream.write_all(&html).unwrap();
            // if let Err(_) = stream.flush() {
            //     println!("Error occured sending response.");
            //     break;
            // }
        // }