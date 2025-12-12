import gspread
from google.oauth2.service_account import Credentials
import os
import datetime
import traceback
from django.conf import settings

# Define the scope
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

def get_client():
    """Authenticates and returns the gspread client."""
    # Try to get credentials from environment variable first, then fallback to file
    creds_path = os.environ.get('GOOGLE_SHEETS_CREDENTIALS', 'sheet.json')
    
    if not os.path.exists(creds_path):
        print(f"Warning: Credentials file not found at {creds_path}. Google Sheets integration will not work.")
        return None

    credentials = Credentials.from_service_account_file(creds_path, scopes=SCOPES)
    client = gspread.authorize(credentials)
    return client

def submit_order(order_data):
    """
    Appends order data to the Google Sheet.
    order_data should be a list: [OrderID, Date, Name, Phone, Address, Items, Quantity, Subtotal, Discount, Total, Status]
    """
    client = get_client()
    if not client:
        return False
        
    try:
        # Spreadsheet Name - Adjust if needed or move to settings
        SHEET_NAME = "KataleyaOrders" 
        spreadsheet = client.open(SHEET_NAME)
        worksheet = spreadsheet.sheet1 # Assuming first sheet
        
        # Find the first empty row based on Column A (Name)
        # append_row skips rows with pre-filled checkboxes or styling.
        # This approach finds the first row where 'Name' is empty.
        col_a_values = worksheet.col_values(1)
        next_row = len(col_a_values) + 1
        
        # Update the row starting from Column A
        worksheet.update(range_name=f"A{next_row}", values=[order_data])
        return True
    except Exception as e:
        error_msg = f"Error submitting order to Google Sheets: {e}\n{traceback.format_exc()}"
        print(error_msg)
        with open("sheets_error.log", "a", encoding="utf-8") as f:
            f.write(f"{datetime.datetime.now()}: {error_msg}\n")
        return False
