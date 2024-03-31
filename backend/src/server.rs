use std::io::{prelude::*, BufReader};
use std::net::{TcpListener, TcpStream};

pub fn init() {
    let port: &str = "1818";
    let host: &str = "127.0.0.1";
    let hn: &str = &format!("{}:{}", &host, &port);


    println!("Starting server on port {}", &hn);
    let listener = TcpListener::bind(&hn).unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();
        println!("con established on ");
        handle_connection(stream);
    }
}


fn handle_connection(mut stream: TcpStream) {
    // First parse the request line to see what we have
    let buf_r = BufReader::new(&mut stream);
    let data_itr = buf_r.lines()
    .map(|result| result.unwrap());
    // .collect();
    parse_request_ln(data_itr);
    // println!("data received {:#?}", data_itr);
}

fn parse_request_ln<I: Iterator>(stream: I)
where
    I: Iterator<Item = String>,
{
    let headers_itr = stream
        .take_while(|chunk| !chunk.is_empty());
    
    let more  = stream
    .take_while(|chunk| !chunk.is_empty());
}




// fn connect_stream() {
//     let mut stream = TcpStream::connect(&lh).unwrap();
//     stream.write(&[98, 108, 97, 99, 107, 106, 97, 99, 107, 32, 116, 105, 109, 101, 33]);
// }
