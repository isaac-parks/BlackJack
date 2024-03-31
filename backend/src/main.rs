use std::io::{prelude::*, BufReader};
use std::net::{TcpListener, TcpStream};

const lh: &str = "127.0.0.1:1818";

fn main() {
    let listener = TcpListener::bind(&lh).unwrap();
    connect_stream();

    for stream in listener.incoming() {
        let stream = stream.unwrap();
        println!("con established on 1818");
        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let buf_r = BufReader::new(&mut stream);
    let data: Vec<_> = buf_r.lines()
    .map(|result| result.unwrap())
    .collect();
    println!("data received {:#?}", data);
}

fn connect_stream() {
    let mut stream = TcpStream::connect(&lh).unwrap();
    stream.write(&[98, 108, 97, 99, 107, 106, 97, 99, 107, 32, 116, 105, 109, 101, 33]);
}
