#!/usr/bin/env python3
"""Import the Riftbound catalog into Appwrite using an API key."""

import csv
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "riftbound_catalog_data" / "cards.csv"
IMAGE_DIR = ROOT / "images"
BATCH_SIZE = 100


def request(base_url, project_id, api_key, path, method="GET", body=None, content_type="application/json"):
    headers = {"X-Appwrite-Project": project_id, "X-Appwrite-Key": api_key}
    if body is not None:
        headers["Content-Type"] = content_type
    request_data = urllib.request.Request(f"{base_url.rstrip('/')}{path}", data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request_data) as response:
            return json.loads(response.read() or b"{}")
    except urllib.error.HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Appwrite request failed ({error.code}): {details}") from error


def split_values(value):
    return [item for item in (value or "").split("|") if item]


def nullable_int(value):
    return int(value) if value else None


def card_record(row, project_id, endpoint, bucket_id):
    image_file = row["image_file"] or None
    image_url = None
    if image_file:
        image_url = f"{endpoint.rstrip('/')}/storage/buckets/{bucket_id}/files/{row['id']}/view?project={urllib.parse.quote(project_id)}"
    return {
        "name": row["name"], "code": row["code"] or None, "public_code": row["public_code"] or None,
        "set_code": row["set_code"] or None, "set_name": row["set_name"] or None,
        "collector_number": nullable_int(row["collector_number"]), "rarity": row["rarity"] or None,
        "type": row["type"] or None, "cost": nullable_int(row["cost"]), "might": nullable_int(row["might"]),
        "power": nullable_int(row["power"]), "domains": split_values(row["domains"]), "tags": split_values(row["tags"]),
        "ability_text": row["ability_text"] or None, "artists": split_values(row["artists"]),
        "orientation": row["orientation"] or None, "image_file": image_file, "image_url": image_url,
        "is_alternate_art": row["is_alternate_art"].lower() == "true", "is_signed": row["is_signed"].lower() == "true",
        "is_overnumbered": row["is_overnumbered"].lower() == "true", "is_variant": row["is_variant"].lower() == "true",
    }


def multipart(file_id, file_name, file_bytes):
    boundary = "----RiftTradeAppwriteBoundary"
    body = b"--" + boundary.encode() + b"\r\n"
    body += b'Content-Disposition: form-data; name="fileId"\r\n\r\n'
    body += file_id.encode() + b"\r\n"
    body += b"--" + boundary.encode() + b"\r\n"
    body += f'Content-Disposition: form-data; name="file"; filename="{file_name}"\r\n'.encode()
    body += b"Content-Type: image/png\r\n\r\n" + file_bytes + b"\r\n"
    body += b"--" + boundary.encode() + b"--\r\n"
    return body, f"multipart/form-data; boundary={boundary}"


def main():
    endpoint = os.environ.get("APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1")
    project_id = os.environ.get("APPWRITE_PROJECT_ID")
    api_key = os.environ.get("APPWRITE_API_KEY")
    database_id = os.environ.get("APPWRITE_DATABASE_ID", "rifttrade")
    bucket_id = os.environ.get("APPWRITE_CARD_BUCKET_ID", "card-images")
    if not project_id or not api_key:
        raise SystemExit("Set APPWRITE_PROJECT_ID and APPWRITE_API_KEY first.")
    with CSV_PATH.open(newline="", encoding="utf-8") as csv_file:
        rows = list(csv.DictReader(csv_file))
    image_files = {image.stem: image for image in IMAGE_DIR.glob("*.png")}
    for index, (file_id, image_file) in enumerate(sorted(image_files.items()), start=1):
        body, content_type = multipart(file_id, image_file.name, image_file.read_bytes())
        request(endpoint, project_id, api_key, f"/storage/buckets/{bucket_id}/files", "POST", body, content_type)
        print(f"Uploaded image {index}/{len(image_files)}")
    for offset in range(0, len(rows), BATCH_SIZE):
        for row in rows[offset : offset + BATCH_SIZE]:
            payload = json.dumps({"documentId": row["id"], "data": card_record(row, project_id, endpoint, bucket_id)}).encode()
            request(endpoint, project_id, api_key, f"/databases/{database_id}/collections/cards/documents", "POST", payload)
        print(f"Imported cards {min(offset + BATCH_SIZE, len(rows))}/{len(rows)}")


if __name__ == "__main__":
    main()