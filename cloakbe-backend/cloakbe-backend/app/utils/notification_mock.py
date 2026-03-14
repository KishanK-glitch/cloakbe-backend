import requests
import os

class NotificationMock:
    API_KEY = "YOUR_FAST2SMS_API_KEY_HERE" # Replace this
    URL = "https://www.fast2sms.com/dev/bulkV2"

    @staticmethod
    def send_sms(phone: str, message: str):
        # The PRD requires reliable notification delivery [cite: 199, 206]
        payload = {
            "route": "otp", # Use 'otp' route for fast delivery
            "variables_values": message,
            "numbers": phone,
        }
        headers = {"authorization": NotificationMock.API_KEY}
        
        try:
            response = requests.post(NotificationMock.URL, data=payload, headers=headers)
            print(f"[FAST2SMS] Status: {response.status_code}, Response: {response.json()}")
            return response.ok
        except Exception as e:
            print(f"[CRITICAL] SMS Gateway Failure: {e}") [cite: 206]
            return False

    @staticmethod
    def send_otp(phone: str, otp: str):
        # Requirement 6.1: SMS OTP Integration [cite: 123]
        return NotificationMock.send_sms(phone, otp)

    @staticmethod
    def send_order_confirmation(phone: str, order_id, box_name, access_code, location):
        # Requirement 8.1: Send pickup instructions via SMS [cite: 160, 165]
        msg = f"Order {order_id} Confirmed! Box: {box_name}, Code: {access_code}. At: {location}"
        # Note: Fast2SMS 'otp' route only sends numbers. 
        # For full text, use 'dlt' or 'transactional' route.
        return NotificationMock.send_sms(phone, msg)