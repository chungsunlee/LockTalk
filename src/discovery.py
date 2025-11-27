# src/discovery.py
import socket
import threading
import logging
from zeroconf import ServiceInfo, Zeroconf

# Set up logging for this module
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

def get_local_ip():
    """
    Retrieves the primary local IP address of the machine.
    This is a robust method to find the IP used for outbound connections.
    """
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        # Doesn't have to be reachable, this just gets the OS to pick an interface
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        log.warning("Could not determine primary IP, falling back to hostname resolution.")
        try:
            # Fallback for environments where the connect trick doesn't work
            IP = socket.gethostbyname(socket.gethostname())
        except Exception:
            log.error("Could not determine IP via hostname, defaulting to 127.0.0.1.")
            IP = '127.0.0.1' # Last resort
    finally:
        s.close()
    return IP

class MDNSAdvertiser:
    """
    Handles the advertising of the LockTalk service via mDNS (Zeroconf).
    Runs in a separate thread to not block the main application.
    """
    def __init__(self, name="LockTalk Server", port=8000):
        self.name = name
        self.port = port
        self.zeroconf = None
        self.service_info = None
        self.thread = None
        self.stop_event = threading.Event()

    def start(self):
        """Starts the mDNS advertising in a background thread."""
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def _run(self):
        """The main logic for the advertiser thread."""
        try:
            ip_address = get_local_ip()
            if ip_address == '127.0.0.1':
                log.warning("mDNS is advertising a localhost address. Other devices may not be able to connect.")

            service_type = "_locktalk._tcp.local."
            service_name = f"{self.name}.{service_type}"
            server_name = "locktalk-server.local."

            self.service_info = ServiceInfo(
                type_=service_type,
                name=service_name,
                addresses=[socket.inet_aton(ip_address)],
                port=self.port,
                properties={'path': '/'}, # Standard property
                server=server_name,
            )

            self.zeroconf = Zeroconf()
            log.info(f"Advertising service '{service_name}' on {ip_address}:{self.port} as '{server_name}'")
            self.zeroconf.register_service(self.service_info)
            
            # Wait until the stop event is set
            self.stop_event.wait()

        except Exception as e:
            log.error(f"An error occurred in the mDNS advertiser thread: {e}", exc_info=True)
        finally:
            if self.zeroconf:
                log.info("Closing Zeroconf instance.")
                self.zeroconf.close()


    def stop(self):
        """Stops the mDNS advertiser gracefully."""
        if self.zeroconf and self.service_info:
            log.info("Unregistering mDNS service...")
            try:
                self.zeroconf.unregister_service(self.service_info)
            except Exception as e:
                log.error(f"Error during service unregistration: {e}", exc_info=True)
        self.stop_event.set()
        log.info("mDNS advertiser stop signal sent.")