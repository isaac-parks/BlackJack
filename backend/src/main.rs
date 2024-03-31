use std::io::{prelude::*, BufReader};
use std::net::{TcpListener, TcpStream};

const lh: &str = "127.0.0.1:1818";

mod server;


fn main() {
    server::init();
}