import os
import time
import threading
import uuid
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import converters

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.abspath('uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

def cleanup_files():
    while True:
        now = time.time()
        for filename in os.listdir(UPLOAD_FOLDER):
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            # Delete files older than 10 minutes (600 seconds)
            if os.path.isfile(file_path):
                if os.stat(file_path).st_mtime < now - 600:
                    try:
                        os.remove(file_path)
                        print(f"Deleted old file: {filename}")
                    except Exception as e:
                        print(f"Error deleting file {filename}: {e}")
        time.sleep(60)

# Start background cleanup thread
cleanup_thread = threading.Thread(target=cleanup_files, daemon=True)
cleanup_thread.start()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/convert', methods=['POST'])
def convert_file():
    print("Convert request received")
    conversion_type = request.form.get('type')
    print(f"Conversion type: {conversion_type}")

    unique_id = str(uuid.uuid4())[:8]
    output_filename = ""
    output_path = ""

    try:
        if conversion_type == 'merge-pdf':
            files = request.files.getlist('file')
            if not files:
                 return jsonify({"error": "No files uploaded"}), 400
            
            input_paths = []
            for file in files:
                filename = secure_filename(file.filename)
                input_filename = f"{unique_id}_{filename}"
                input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
                file.save(input_path)
                input_paths.append(input_path)
            
            output_filename = f"{unique_id}_merged.pdf"
            output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
            print("Merging PDFs")
            converters.merge_pdfs(input_paths, output_path)

        else:
            if 'file' not in request.files:
                return jsonify({"error": "No file part"}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400

            filename = secure_filename(file.filename)
            base, ext = os.path.splitext(filename)
            input_filename = f"{unique_id}_{filename}"
            input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
            file.save(input_path)
            
            print(f"File saved to {input_path}")
            print(f"Starting conversion for type: {conversion_type}")

            if conversion_type == 'pdf-to-word':
                print("Converting PDF to Word")
                output_filename = f"{unique_id}_{base}.docx"
                output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
                converters.convert_pdf_to_word(input_path, output_path)

            elif conversion_type == 'word-to-pdf':
                print("Converting Word to PDF")
                output_filename = f"{unique_id}_{base}.pdf"
                output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
                converters.convert_word_to_pdf(input_path, output_path)

            elif conversion_type in ['jpg-to-pdf', 'png-to-pdf']:
                print("Converting image to PDF")
                output_filename = f"{unique_id}_{base}.pdf"
                output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
                converters.convert_image(input_path, output_path, 'PDF')

            elif conversion_type == 'image-convert':
                print("Converting image format")
                target_format = request.form.get('format', 'JPG')
                output_filename = f"{unique_id}_{base}.{target_format.lower()}"
                output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
                converters.convert_image(input_path, output_path, target_format)

            elif conversion_type == 'compress-image':
                print("Compressing image")
                output_filename = f"{unique_id}_compressed_{base}{ext}"
                output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
                converters.compress_image(input_path, output_path, quality=50)

            else:
                print(f"Invalid conversion type: {conversion_type}")
                return jsonify({"error": "Invalid conversion type"}), 400

        print(f"Conversion successful, output: {output_filename}")
        base_url = os.environ.get('RENDER_EXTERNAL_URL', 'http://localhost:5000')
        return jsonify({
            "message": "Conversion successful",
            "download_url": f"{base_url}/download/{output_filename}",
            "filename": output_filename
        })

    except Exception as e:
        print(f"Conversion error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/download/<filename>')
def download_file(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
