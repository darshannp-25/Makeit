import os
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

def convert_pdf_to_word(pdf_path, word_path):
    cv = Converter(pdf_path)
    cv.convert(word_path, start=0, end=None)
    cv.close()

def convert_word_to_pdf(word_path, pdf_path):
    # NOTE: definition might vary based on OS. 
    # taking simplest approach for windows dev environment first
    # For linux/production, we might need libreoffice
    try:
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
