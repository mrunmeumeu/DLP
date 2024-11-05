import socket

def start_server():
    # Create a socket object
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # Bind to the address (IP and port)
    server_socket.bind(('192.168.1.34', 65432))  # Replace YOUR_ADMIN_IP with the admin's IP address
    server_socket.listen(1)
    
    print("Waiting for connections...")
    
    # Accept a connection from the client (endpoint)
    conn, addr = server_socket.accept()
    print(f"Connection from {addr}")
    
    while True:
        # Get command from admin
        command = input("Enter 'start1' to run the first file, 'start2' for the second file, or 'exit' to stop: ")
        
        if command in ['start1', 'start2', 'exit']:
            conn.sendall(command.encode())
            if command == 'exit':
                print("Exiting...")
                break
        else:
            print("Invalid command.")

    conn.close()

if __name__ == "__main__":
    start_server()
