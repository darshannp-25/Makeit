import os
import sys
# Try importing win32com for better Windows conversion
try:
    import win32com.client
    import pythoncom
    HAS_WIN32 = True
except ImportError:
    HAS_WIN32 = False

from pdf2docx import Converter
from pdf2docx import parse
from docx2pdf import convert as docx_convert
from PIL import Image
import io
from pypdf import PdfWriter

def merge_pdfs(input_paths, output_path):
    merger = PdfWriter()
    for path in input_paths:
        merger.append(path)
    merger.write(output_path)
    merger.close()

def convert_pdf_to_word_with_word(pdf_path, word_path):
    """
    Uses MS Word to convert PDF to Word. This usually preserves fonts and layout better.
    """
    word = None
    doc = None
    try:
        # Initialize COM for this thread
        pythoncom.CoInitialize()
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        word.DisplayAlerts = False
        
        # Open PDF (Word will convert it)
        # ConfirmConversions=False supposedly skips the dialog, but Format=wdOpenFormatAuto might be safer
        doc = word.Documents.Open(pdf_path, ConfirmConversions=False, ReadOnly=True)
        
        # Save as Docx (wdFormatXMLDocument = 12, wdFormatDocumentDefault = 16)
        doc.SaveAs2(word_path, FileFormat=16)
        return True
    except Exception as e:
        print(f"Word COM conversion failed: {e}")
        return False
    finally:
        if doc:
            try:
                doc.Close(SaveChanges=False)
            except:
                pass
        if word:
            try:
                word.Quit()
            except:
                pass
        pythoncom.CoUninitialize()

def convert_pdf_to_word(pdf_path, word_path):
    success = False
    
    # Try Word first if on Windows and available
    if HAS_WIN32:
        print("Attempting PDF to Word conversion using MS Word...")
        success = convert_pdf_to_word_with_word(os.path.abspath(pdf_path), os.path.abspath(word_path))
    
    if not success:
        print("Falling back to pdf2docx for PDF to Word conversion...")
        cv = Converter(pdf_path)
        cv.convert(word_path, start=0, end=None)
        cv.close()

def convert_word_to_pdf(word_path, pdf_path):
    # NOTE: definition might vary based on OS. 
    # taking simplest approach for windows dev environment first
    # For linux/production, we might need libreoffice
    try:
        # docx2pdf uses Word on Windows, which handles fonts well if installed
        docx_convert(word_path, pdf_path)
    except Exception as e:
        print(f"Error converting docx directly: {e}")
        # Fallback or specific linux handling would go here
        raise e

def convert_image(input_path, output_path, format):
    with Image.open(input_path) as img:
        if format.upper() == 'JPG' or format.upper() == 'JPEG':
            rgb_im = img.convert('RGB')
            rgb_im.save(output_path, quality=95)
        elif format.upper() == 'PDF':
            rgb_im = img.convert('RGB')
            rgb_im.save(output_path, 'PDF')
        else:
            img.save(output_path, format=format)

def compress_image(input_path, output_path, quality=60):
    with Image.open(input_path) as img:
        if input_path.lower().endswith('.png'):
             # PNG compression is different, usually just optimization
             img.save(output_path, optimize=True, quality=quality)
        else:
            # JPG/WEBP
            img.convert('RGB').save(output_path, quality=quality)

# Crop helper - generic
def crop_image(input_path, output_path, box):
    # box = (left, upper, right, lower)
    with Image.open(input_path) as img:
        cropped = img.crop(box)
        cropped.save(output_path)
