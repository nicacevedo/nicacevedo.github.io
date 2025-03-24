from PIL import Image
import pillow_heif
import os

def convert_heic_to_jpg(input_path, output_path, new_size=None):
    # Open HEIC image using pillow_heif
    heif_image = pillow_heif.open_heif(input_path)
    image = Image.frombytes(
        heif_image.mode,
        heif_image.size,
        heif_image.data,
        "raw"
    )
    
    # Resize the image if new_size is provided
    if new_size:
        image = image.resize(new_size, Image.LANCZOS)
    
    # Save as JPG
    image.save(output_path, "JPEG")
    print(f"Converted and saved: {output_path}")


def convert_jpg_to_png(input_path, output_path, new_size=None):
    # Open JPG image
    image = Image.open(input_path)
    
    # Resize the image if new_size is provided
    if new_size:
        image = image.resize(new_size, Image.LANCZOS)
    
    # Save as JPG
    image.save(output_path, "PNG")
    print(f"Converted and saved: {output_path}")

# Example usage
# input_file = "./images/profile.heic"
input_file = "./images/profile_new.jpg"
output_file = "images/profile_new.png"
new_dimensions = (720, 720)  # Set new dimensions (width, height)
# convert_heic_to_jpg(input_file, output_file, new_dimensions)
convert_jpg_to_png(input_file, output_file, new_size=new_dimensions)
