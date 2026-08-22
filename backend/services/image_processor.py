import cv2
import numpy as np
from PIL import Image


def deskew_image(gray_image: np.ndarray) -> np.ndarray:
    try:
        coords = np.column_stack(np.where(gray_image > 0))
        if len(coords) < 10:
            return gray_image

        angle = cv2.minAreaRect(coords)[-1]
        
        if angle < -45:
            angle = -(90 + angle)
        elif angle > 45:
            angle = 90 - angle
        else:
            angle = -angle

        if abs(angle) < 0.5 or abs(angle) > 45:
            return gray_image

        (h, w) = gray_image.shape[:2]
        center = (w // 2, h // 2)
        rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
        deskewed = cv2.warpAffine(
            gray_image, rotation_matrix, (w, h),
            flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
        )
        return deskewed
    except Exception:
        return gray_image


def preprocess_image_opencv(image_bytes: bytes) -> tuple:
    np_array = np.frombuffer(image_bytes, np.uint8)
    bgr_img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if bgr_img is None:
        raise ValueError("Could not decode image from provided file bytes.")

    height, width = bgr_img.shape[:2]
    if height > width:
        bgr_img = cv2.rotate(bgr_img, cv2.ROTATE_90_CLOCKWISE)

    gray = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2GRAY)

    avg_brightness = cv2.mean(gray)[0]
    if avg_brightness < 127:
        gray = cv2.bitwise_not(gray)

    denoised = cv2.bilateralFilter(gray, d=9, sigmaColor=75, sigmaSpace=75)

    _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    processed_gray = deskew_image(thresh)

    pil_processed = Image.fromarray(processed_gray)
    pil_original = Image.fromarray(cv2.cvtColor(bgr_img, cv2.COLOR_BGR2RGB))

    return pil_processed, pil_original