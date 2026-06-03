# ESP32 - 利用網頁伺服器讀取及控制電子元件

## 1. 網頁伺服器 - 使用網址index

### Arduino C/C++
```C++
#include <WiFi.h>
#include <DHT.h>

#define DHTPIN 13     // DHT11傳感器連接GPIO
#define DHTTYPE DHT11 // 需要安裝DHT sensor library by Adafruit
#define LED_PIN 2     // 板載 LED

const char* ssid = "<wifi-name>";          // WiFi 名稱
const char* password = "<wifi-password>";   // WiFi 密碼

DHT dht(DHTPIN, DHTTYPE);             // 建立名為dht的Object
WiFiServer server(80);                // 建立名為dht的Object, 將port80收到的資訊傳到web server
bool ledState = false; 

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  
  dht.begin();                                            // 初始化DHT11
  WiFi.begin(ssid, password);                             // 連接WiFi
  while (WiFi.status() != WL_CONNECTED) { delay(500); }   // 每0.5秒檢查WiFi是否連接成功
  
  server.begin();                                         // 啟動Web Server
  Serial.print("伺服器已啟動，IP 位址: ");                 
  Serial.println(WiFi.localIP());                         // 顯示ESP32的IP位址(本地)
}

void loop() {
  WiFiClient client = server.available();                 // 檢查是否有client
  if (!client) return;                                    
  
  String request = client.readStringUntil('\r');          // client傳訊息給web server，分割點在'\r'
  // 處理 LED 控制請求 (網址後輟postfix)
  if (request.indexOf("GET /LED=ON") >= 0) { digitalWrite(LED_PIN, HIGH); ledState = true; }
  if (request.indexOf("GET /LED=OFF") >= 0) { digitalWrite(LED_PIN, LOW); ledState = false; }
  
  // 讀取溫濕度
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  
  // 回傳應答標頭
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html; charset=utf-8");
  client.println("Connection: close");
  client.println();
  
  // 生成 HTML 網頁
  client.println("<!DOCTYPE html><html><head><meta charset='utf-8'><title>ESP32 控制面板</title></head><body>");
  client.println("<h2>ESP32 控制面板</h2>");
  client.print("<p>LED 狀態: <strong>"); client.print(ledState ? "點亮" : "熄滅"); client.println("</strong></p>");
  client.println("<p><a href=\"/LED=ON\"><button>點亮 LED</button></a> ");
  client.println("<a href=\"/LED=OFF\"><button>關閉 LED</button></a></p>");
  client.print("<p>當前溫度: "); client.print(t); client.println(" &deg;C</p>");
  client.print("<p>當前濕度: "); client.print(h); client.println(" %</p>");
  client.println("</body></html>");
  
  delay(1);
  client.stop();
}
```

### MicroPython

```python
import network
import socket
import machine
import dht
import time

# 初始化硬體
led = machine.Pin(2, machine.Pin.OUT)
sensor = dht.DHT11(machine.Pin(13))

# 連接 WiFi
SSID = '您的_WiFi_名稱'
PASSWORD = '您的_WiFi_密碼'

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, PASSWORD)

while not wlan.isconnected():
    time.sleep(0.5)

print("伺服器已啟動，IP 位址:", wlan.ifconfig()[0])

# 建立 Socket 伺服器
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(5)

while True:
    conn, addr = s.accept()
    request = conn.recv(1024).decode('utf-8')
    
    # 處理 LED 控制
    if 'GET /LED=ON' in request:
        led.value(1)
    elif 'GET /LED=OFF' in request:
        led.value(0)
        
    led_status = "點亮" if led.value() == 1 else "熄滅"
    
    # 讀取溫濕度（加入異常處理防止讀取失敗導致程式崩潰）
    try:
        sensor.measure()
        t = sensor.temperature()
        h = sensor.humidity()
    except Exception as e:
        t, h = "讀取失敗", "讀取失敗"
        
    # 生成 HTML 網頁
    html = f"""HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Connection: close

<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>ESP32 控制面板</title></head>
<body>
    <h2>ESP32 控制面板</h2>
    <p>LED 狀態: <strong>{led_status}</strong></p>
    <p>
        <a href="/LED=ON"><button>點亮 LED</button></a>
        <a href="/LED=OFF"><button>關閉 LED</button></a>
    </p>
    <p>當前溫度: {t} &deg;C</p>
    <p>當前濕度: {h} %</p>
</body>
</html>
"""
    conn.send(html.encode('utf-8'))
    conn.close()
```
## 2. 網頁伺服器 - 使用Websocket

### Arduino C/C++


### MicroPython

```python
import socket
import select
import hashlib
import ubinascii
import time
from machine import Pin
import dht
import network

# 1. 初始化硬體
led = Pin(2, Pin.OUT)
sensor = dht.DHT11(Pin(13))
led_state = False

# 2. 網路連線
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect('您的_WiFi_名稱', '您的_WiFi_密碼')
while not wlan.isconnected():
    pass
print("伺服器 IP:", wlan.ifconfig()[0])

# 3. 前端網頁 HTML
html_content = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"><title>ESP32 WebSocket</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
    button { padding: 10px 20px; font-size: 18px; cursor: pointer; }
    .card { border: 1px solid #ccc; padding: 20px; border-radius: 10px; display: inline-block; }
  </style>
  <script>
    var ws;
    function init() {
      // 建立連接到本機的 WebSocket 連線
      ws = new WebSocket('ws://' + window.location.host + '/');
      ws.onmessage = function(event) {
        var data = JSON.parse(event.data);
        document.getElementById('led').innerText = data.led ? "點亮 🟢" : "熄滅 🔴";
        document.getElementById('temp').innerText = data.temp;
        document.getElementById('hum').innerText = data.hum;
      };
    }
    function toggle() { ws.send('toggle'); }
    window.onload = init;
  </script>
</head>
<body>
  <div class="card">
    <h2>ESP32 即時控制面板 (MicroPython 原生版)</h2>
    <p>LED 狀態: <strong id="led">讀取中...</strong></p>
    <button onclick="toggle()">切換 LED 燈</button>
    <hr>
    <p>🌡️ 當前溫度: <span id="temp">--</span> &deg;C</p>
    <p>💧 當前濕度: <span id="hum">--</span> %</p>
  </div>
</body>
</html>"""

# 4. WebSocket 協定助手函數
def perform_handshake(conn, req_data):
    """ 解析 Sec-WebSocket-Key 並回傳 101 Handshake 響應 """
    key = ""
    for line in req_data.split("\r\n"):
        if "Sec-WebSocket-Key:" in line:
            key = line.split(":")[1].strip()
            break
    if not key:
        return False
    
    # WebSocket 規範之魔術字串 GUID
    guid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
    # 計算 SHA-1 並進行 Base64 編碼
    hash_val = hashlib.sha1((key + guid).encode()).digest()
    accept_key = ubinascii.b2a_base64(hash_val).strip().decode()
    
    handshake_resp = (
        "HTTP/1.1 101 Switching Protocols\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        "Sec-WebSocket-Accept: " + accept_key + "\r\n\r\n"
    )
    conn.send(handshake_resp.encode())
    return True

def decode_ws_frame(data):
    """ 解析客戶端傳來的 WebSocket 數據訊框（僅處理簡單的短文字） """
    if len(data) < 6:
        return None
    # 檢查是否為 Text Frame (Opcode 1)
    if (data[0] & 0x0F) != 1:
        return None
    payload_len = data[1] & 0x7F
    # 僅處理小於 126 位元組的簡單數據
    if payload_len > 125:
        return None
        
    masks = data[2:6]
    payload = data[6:6+payload_len]
    decoded = bytearray(payload_len)
    for i in range(payload_len):
        decoded[i] = payload[i] ^ masks[i % 4]
    return decoded.decode('utf-8')

def encode_ws_frame(message):
    """ 將文字打包成 WebSocket 數據訊框傳給客戶端 """
    msg_bytes = message.encode('utf-8')
    length = len(msg_bytes)
    if length <= 125:
        return bytes([0x81, length]) + msg_bytes
    else:
        return bytes([0x81, 126, (length >> 8) & 0xFF, length & 0xFF]) + msg_bytes

# 5. 建立主 Socket 監聽
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(('', 80))
server.listen(5)

ws_clients = []  # 存放已成功握手的 WebSocket 客戶端連線
last_update = time.ticks_ms()

print("WebSocket 伺服器正在 Port 80 運行...")

while True:
    # 藉由 select.select 非阻塞地監聽 Socket 狀態
    r_sockets = [server] + ws_clients
    readable, _, _ = select.select(r_sockets, [], [], 0.1)
    
    for sock in readable:
        if sock is server:
            # 有新的 TCP 連線進來
            conn, addr = server.accept()
            try:
                request = conn.recv(1024).decode('utf-8')
                if "Upgrade: websocket" in request:
                    # 如果是 WebSocket 握手請求
                    if perform_handshake(conn, request):
                        ws_clients.append(conn)
                        print("新 WebSocket 用戶已連線：", addr)
                else:
                    # 一般 HTTP 請求，直接噴出 HTML 控制網頁
                    http_response = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n\r\n" + html_content
                    conn.send(http_response.encode())
                    conn.close()
            except Exception as e:
                conn.close()
        else:
            # 這是已連接的 WebSocket 用戶發來訊息
            try:
                data = sock.recv(1024)
                if not data:
                    # 客戶端中斷連線
                    sock.close()
                    ws_clients.remove(sock)
                    print("WebSocket 用戶中斷連線")
                    continue
                
                msg = decode_ws_frame(data)
                if msg == "toggle":
                    led_state = not led_state
                    led.value(1 if led_state else 0)
                    
                    # 狀態改變，立刻向所有連線中的網頁廣播新狀態
                    try:
                        sensor.measure()
                        t, h = sensor.temperature(), sensor.humidity()
                    except:
                        t, h = "--", "--"
                    
                    payload = '{"led": %s, "temp": "%s", "hum": "%s"}' % (
                        "true" if led_state else "false", t, h
                    )
                    frame = encode_ws_frame(payload)
                    for client in ws_clients:
                        client.send(frame)
            except Exception as e:
                sock.close()
                if sock in ws_clients:
                    ws_clients.remove(sock)

    # 每 2 秒自動讀取溫濕度並向所有連線的 WebSocket 推播
    if time.ticks_diff(time.ticks_ms(), last_update) > 2000:
        if ws_clients:
            try:
                sensor.measure()
                t, h = sensor.temperature(), sensor.humidity()
            except:
                t, h = "--", "--"
                
            payload = '{"led": %s, "temp": "%s", "hum": "%s"}' % (
                "true" if led_state else "false", t, h
            )
            frame = encode_ws_frame(payload)
            for client in ws_clients:
                try:
                    client.send(frame)
                except:
                    pass
        last_update = time.ticks_ms()


```

