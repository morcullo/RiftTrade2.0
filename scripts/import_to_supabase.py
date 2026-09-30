#!/usr/bin/env python3
"""Import the card catalog and its image URLs into Supabase."""

import csv
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / 'riftbound_catalog_data' / 'cards.csv'
IMAGE_URLS_PATH = ROOT / 'riftbound_image_urls.csv'
BATCH_SIZE = 100


def request(url, method='GET', body=None, content_type='application/json', extra_headers=None):
    key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
    headers = {'Authorization': f'Bearer {key}', 'apikey': key}
    headers.update(extra_headers or {})
    if body is not None:
        headers['Content-Type'] = content_type
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=body, headers=headers, method=method)) as response:
            return response.read()
    except urllib.error.HTTPError as error:
        details = error.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'Supabase request failed ({error.code}): {details}') from error


def split_values(value):
    return [item for item in (value or '').split('|') if item]


def nullable_int(value):
    return int(value) if value else None


def card_record(row, image_url):
    return {
        'id': row['id'], 'name': row['name'], 'code': row['code'] or None,
        'public_code': row['public_code'] or None, 'set_code': row['set_code'] or None,
        'set_name': row['set_name'] or None, 'collector_number': nullable_int(row['collector_number']),
        'rarity': row['rarity'] or None, 'type': row['type'] or None,
        'cost': nullable_int(row['cost']), 'might': nullable_int(row['might']), 'power': nullable_int(row['power']),
        'domains': split_values(row['domains']), 'tags': split_values(row['tags']),
        'ability_text': row['ability_text'] or None, 'artists': split_values(row['artists']),
        'orientation': row['orientation'] or None, 'image_file': None,
        'image_path': None, 'image_url': image_url,
        'is_alternate_art': row['is_alternate_art'].lower() == 'true',
        'is_signed': row['is_signed'].lower() == 'true',
        'is_overnumbered': row['is_overnumbered'].lower() == 'true',
        'is_variant': row['is_variant'].lower() == 'true',
    }


def main():
    base_url = os.environ.get('SUPABASE_URL', '').rstrip('/')
    if not base_url or not os.environ.get('SUPABASE_SERVICE_ROLE_KEY'):
        raise SystemExit('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.')
    with CSV_PATH.open(newline='', encoding='utf-8') as csv_file:
        source_rows = list(csv.DictReader(csv_file))
    with IMAGE_URLS_PATH.open(newline='', encoding='utf-8') as csv_file:
        image_urls = {row['id']: row['image_url'] for row in csv.DictReader(csv_file)}
    missing_ids = [row['id'] for row in source_rows if not image_urls.get(row['id'])]
    if missing_ids:
        raise SystemExit(f'Missing image URLs for {len(missing_ids)} cards (first: {missing_ids[0]}).')
    records = [card_record(row, image_urls[row['id']]) for row in source_rows]
    endpoint = f'{base_url}/rest/v1/cards?on_conflict=id'
    for offset in range(0, len(records), BATCH_SIZE):
        batch = json.dumps(records[offset:offset + BATCH_SIZE]).encode('utf-8')
        request(endpoint, method='POST', body=batch, extra_headers={'Prefer': 'resolution=merge-duplicates,return=minimal'})
        print(f'Imported cards {min(offset + BATCH_SIZE, len(records))}/{len(records)}')


if __name__ == '__main__':
    main()