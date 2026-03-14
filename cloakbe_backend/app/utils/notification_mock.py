class NotificationMock:
    @staticmethod
    def send_otp(phone: str, otp: str):
        # Fallback to simulation to bypass DLT/KYC restrictions
        print(f"\n{'='*40}")
        print(f"[SMS GATEWAY SIMULATION]")
        print(f"To: {phone}")
        print(f"Verification Code: {otp}")
        print(f"{'='*40}\n")
        return True

    @staticmethod
    def send_order_confirmation(phone: str, order_id: str, box_name: str, access_code: str, terminal_location: str):
        # Fallback to simulation to bypass DLT/KYC restrictions
        print(f"\n{'='*40}")
        print(f"[SMS NOTIFICATION SIMULATION]")
        print(f"To: {phone}")
        print(f"Order {order_id} Confirmed!")
        print(f"Box: {box_name} | Code: {access_code}")
        print(f"Location: {terminal_location}")
        print(f"{'='*40}\n")
        return True