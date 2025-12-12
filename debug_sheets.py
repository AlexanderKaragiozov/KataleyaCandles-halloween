from candles.sheets_service import get_client

def debug():
    print("--- DEBUGGING GOOGLE SHEETS ACCESS ---")
    client = get_client()
    if not client:
        print("FAILED: Could not authenticate.")
        return

    print(f"Authenticated as: {client.auth.service_account_email}")
    
    try:
        print("\nAttempting to list all accessible spreadsheets...")
        sheets = client.openall()
        
        if not sheets:
            print("RESULT: No spreadsheets found. The bot has access to 0 sheets.")
            print("ACTION REQUIRED: You MUST share the sheet with the email above.")
        else:
            print(f"RESULT: Found {len(sheets)} sheet(s):")
            for i, sheet in enumerate(sheets):
                print(f"  {i+1}. '{sheet.title}' (ID: {sheet.id})")
                
            print("\nCheck if your sheet 'Kataleya Orders' is in this list.")
            print("If it IS in the list but with a slightly different name, update sheets_service.py.")
            print("If it is NOT in the list, you have not shared it correctly.")
            
    except Exception as e:
        print(f"CRITICAL ERROR during listing: {e}")

if __name__ == "__main__":
    debug()
