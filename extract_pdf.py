import sys
try:
    import PyPDF2
    reader = PyPDF2.PdfReader('Detailed_Enterprise_Workforce_Project_Plan_Updated.pdf')
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            print(f"--- PAGE {i+1} ---")
            print(text)
except ImportError:
    try:
        import subprocess
        result = subprocess.run([sys.executable, '-m', 'pip', 'install', 'PyPDF2'], capture_output=True, text=True)
        print("Installing PyPDF2...")
        print(result.stdout)
        print(result.stderr)
        import PyPDF2
        reader = PyPDF2.PdfReader('Detailed_Enterprise_Workforce_Project_Plan_Updated.pdf')
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                print(f"--- PAGE {i+1} ---")
                print(text)
    except Exception as e:
        print(f"Error: {e}")
