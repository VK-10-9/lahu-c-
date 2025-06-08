import os
import sys
import subprocess
import json
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__, static_folder='static', template_folder='static')
CORS(app)

# Path to the compiled C++ executable
CPP_EXECUTABLE = os.path.join('..', 'build', 'bin', 'blood_compatibility.exe' 
                            if os.name == 'nt' else 'blood_compatibility')

def check_blood_compatibility(donor_type, recipient_type):
    """Call the C++ executable to check blood compatibility."""
    try:
        # Run the C++ executable as a subprocess
        result = subprocess.run(
            [CPP_EXECUTABLE, donor_type, recipient_type],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Parse the output
        output = result.stdout.strip()
        if ':' in output:
            compatible, message = output.split(':', 1)
            return {
                'compatible': compatible.lower() == 'true',
                'message': message.strip()
            }
        else:
            return {
                'compatible': False,
                'message': 'Invalid response from compatibility checker'
            }
            
    except subprocess.CalledProcessError as e:
        return {
            'compatible': False,
            'message': f'Error checking compatibility: {e.stderr}'
        }
    except Exception as e:
        return {
            'compatible': False,
            'message': f'Unexpected error: {str(e)}'
        }

@app.route('/')
def index():
    """Serve the main page."""
    return render_template('index.html')

@app.route('/api/check_compatibility', methods=['POST'])
def api_check_compatibility():
    """API endpoint to check blood compatibility."""
    data = request.get_json()
    
    donor_type = data.get('donor_type', '').strip().upper()
    recipient_type = data.get('recipient_type', '').strip().upper()
    
    if not donor_type or not recipient_type:
        return jsonify({
            'error': 'Both donor_type and recipient_type are required'
        }), 400
    
    # Validate blood types
    valid_blood_types = {'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'}
    if donor_type not in valid_blood_types or recipient_type not in valid_blood_types:
        return jsonify({
            'error': 'Invalid blood type. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-'
        }), 400
    
    # Call the C++ function
    result = check_blood_compatibility(donor_type, recipient_type)
    return jsonify(result)

def build_cpp():
    """Build the C++ code and return True if successful."""
    build_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'build')
    try:
        print("Building C++ code...")
        os.makedirs(build_dir, exist_ok=True)
        
        # Run CMake
        subprocess.run(
            ['cmake', '..'],
            cwd=build_dir,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Build the project
        subprocess.run(
            ['cmake', '--build', '.'],
            cwd=build_dir,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if not os.path.exists(CPP_EXECUTABLE):
            print(f"Error: C++ executable not found at {CPP_EXECUTABLE}")
            return False
            
        print("C++ code built successfully!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"Error building C++ code. Command failed with return code {e.returncode}.")
        if e.stdout:
            print("Stdout:", e.stdout)
        if e.stderr:
            print("Stderr:", e.stderr)
        return False
    except Exception as e:
        print(f"Unexpected error building C++ code: {e}")
        return False

def check_blood_compatibility_py(donor_type, recipient_type):
    """Pure Python implementation of blood compatibility check."""
    donor = donor_type.upper()
    recipient = recipient_type.upper()
    
    # Simple blood type compatibility check
    if donor == "O-":
        compatible = True
    elif donor == recipient:
        compatible = True
    elif donor == "O+" and recipient in ["A+", "B+", "AB+", "O+"]:
        compatible = True
    elif donor == "A-" and recipient in ["A+", "A-", "AB+", "AB-"]:
        compatible = True
    elif donor == "B-" and recipient in ["B+", "B-", "AB+", "AB-"]:
        compatible = True
    elif donor == "A+" and recipient in ["A+", "AB+"]:
        compatible = True
    elif donor == "B+" and recipient in ["B+", "AB+"]:
        compatible = True
    elif donor == "AB-" and recipient in ["AB-", "AB+"]:
        compatible = True
    else:
        compatible = (donor == "AB+" and recipient == "AB+")
    
    message = f"Donor ({donor_type}) can{'' if compatible else 'not'} donate to recipient ({recipient_type})."
    return {
        'compatible': compatible,
        'message': message,
        'using_python_fallback': True
    }

# Try to build C++ code on startup
CPP_AVAILABLE = False
if not os.path.exists(CPP_EXECUTABLE):
    CPP_AVAILABLE = build_cpp()
else:
    CPP_AVAILABLE = True

# Use Python implementation if C++ is not available
if not CPP_AVAILABLE:
    print("Warning: Using Python implementation instead of C++")
    check_blood_compatibility = check_blood_compatibility_py

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, port=5000)
