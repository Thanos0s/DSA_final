#!/usr/bin/env python3
"""
APPS Dataset Downloader for ThinkDSA (JSONL Version)
Downloads problems from the Hugging Face APPS dataset (JSONL) and exports to JSON.

Usage:
    python scripts/download_apps.py --count 200
"""

import json
import re
import argparse
import sys
import os
import requests

HF_JSONL_URLS = {
    'train': 'https://huggingface.co/datasets/codeparrot/apps/resolve/main/train.jsonl',
    'test': 'https://huggingface.co/datasets/codeparrot/apps/resolve/main/test.jsonl'
}

def infer_topic(question_text: str) -> str:
    """Infer the topic/category from the problem text using keyword matching."""
    text = question_text.lower()
    if any(k in text for k in ['graph', 'node', 'edge', 'path', 'shortest', 'bfs', 'dfs', 'traversal']):
        return 'Graphs'
    if any(k in text for k in ['dynamic programming', 'dp', 'memoization', 'subproblem', 'optimal substructure']):
        return 'Dynamic Programming'
    if any(k in text for k in ['tree', 'binary tree', 'bst', 'trie', 'heap', 'root', 'leaf', 'subtree']):
        return 'Trees'
    if any(k in text for k in ['sort', 'merge sort', 'quicksort', 'comparator']):
        return 'Sorting'
    if any(k in text for k in ['sliding window', 'two pointer', 'subarray', 'substring']):
        return 'Sliding Window'
    if any(k in text for k in ['binary search', 'mid', 'lower bound', 'upper bound']):
        return 'Binary Search'
    if any(k in text for k in ['stack', 'queue', 'deque', 'monotonic']):
        return 'Stacks & Queues'
    if any(k in text for k in ['hash', 'map', 'dictionary', 'frequency', 'count']):
        return 'Hash Maps'
    if any(k in text for k in ['string', 'substring', 'palindrome', 'anagram', 'character']):
        return 'Strings'
    if any(k in text for k in ['math', 'prime', 'gcd', 'lcm', 'modulo', 'number theory']):
        return 'Mathematics'
    if any(k in text for k in ['greedy', 'maximize', 'minimize', 'optimal', 'interval']):
        return 'Greedy'
    if any(k in text for k in ['backtrack', 'permutation', 'combination', 'subset', 'recursion']):
        return 'Backtracking'
    if any(k in text for k in ['array', 'list', 'sequence', 'element', 'index']):
        return 'Arrays'
    return 'Programming'


def map_difficulty(apps_difficulty: str) -> str:
    mapping = {
        'introductory': 'Easy',
        'interview': 'Medium',
        'competition': 'Hard',
    }
    return mapping.get(apps_difficulty.lower(), 'Medium')


def slugify(title: str, problem_id: int) -> str:
    """Create a URL-safe slug from problem id."""
    return f"apps-{problem_id}"


def format_statement(question: str, url: str = '') -> str:
    """Wrap the raw question text in Markdown format."""
    body = question.strip()
    markdown = f"{body}"
    if url:
        markdown += f"\n\n---\n*Source: [{url}]({url})*"
    return markdown


def extract_title(question: str, problem_id: int) -> str:
    """Extract a short title from the beginning of the question."""
    lines = [l.strip() for l in question.strip().split('\n') if l.strip()]
    if lines:
        title = lines[0]
        # Clean up common prefixes like "-----" and trim to ~80 chars
        title = re.sub(r'^-+\s*', '', title).strip()
        title = re.sub(r'\s*-+$', '', title).strip()
        if len(title) > 80:
            title = title[:77] + '...'
        if title:
            return title
    return f"APPS Problem #{problem_id}"


def process_sample(sample: dict) -> dict | None:
    """Turn one APPS sample into a ThinkDSA-compatible problem dict."""
    try:
        problem_id = sample.get('problem_id', 0)
        question = sample.get('question', '').strip()
        if not question:
            return None

        # Parse JSON fields that come as strings
        raw_io = sample.get('input_output', '{}')
        raw_solutions = sample.get('solutions', '[]')

        input_output = {}
        if isinstance(raw_io, str):
            try:
                input_output = json.loads(raw_io)
            except json.JSONDecodeError:
                pass
        else:
            input_output = raw_io

        solutions = []
        if isinstance(raw_solutions, str):
            try:
                solutions = json.loads(raw_solutions)
            except json.JSONDecodeError:
                pass
        else:
            solutions = raw_solutions

        # Build test cases from input_output
        test_cases = []
        inputs = input_output.get('inputs', [])
        outputs = input_output.get('outputs', [])
        fn_name = input_output.get('fn_name', None)
        for i, (inp, out) in enumerate(zip(inputs[:5], outputs[:5])):  # max 5 test cases
            test_cases.append({'input': str(inp), 'output': str(out)})

        difficulty = map_difficulty(sample.get('difficulty', 'interview'))
        url = sample.get('url', '')
        starter_code = sample.get('starter_code', '') or ''
        topic = infer_topic(question)
        title = extract_title(question, problem_id)
        slug = slugify(title, problem_id)
        statement = format_statement(question, url)

        metadata = {
            'source': url,
            'originalDifficulty': sample.get('difficulty', ''),
            'concepts': [topic],
            'hints': [],
            'starterCode': starter_code,
        }
        if solutions and len(solutions) > 0:
            # Store first solution as reference
            metadata['referenceSolution'] = solutions[0][:2000]  # cap at 2000 chars
        if fn_name:
            metadata['fnName'] = fn_name

        return {
            'title': title,
            'slug': slug,
            'statement': statement,
            'difficulty': difficulty,
            'topic': topic,
            'metadata': json.dumps(metadata),
            'testCases': json.dumps(test_cases),
        }
    except Exception as e:
        print(f"  Warning: failed to process problem {sample.get('problem_id', '?')}: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(description='Download APPS dataset problems for ThinkDSA')
    parser.add_argument('--count', type=int, default=200, help='Number of problems to download (default: 200)')
    parser.add_argument('--split', type=str, default='train', choices=['train', 'test'], help='Dataset split to use (default: train)')
    parser.add_argument('--output', type=str, default='scripts/apps_problems.json', help='Output JSON file path')
    args = parser.parse_args()

    os.environ['PYTHONUTF8'] = '1'
    url = HF_JSONL_URLS[args.split]
    
    print(f"📥 Downloading {args.split} split from {url}...")
    
    # We download line by line or stream it to avoid memory issues if it's huge
    # (train.jsonl is ~107MB, which is fine for memory, but let's be safe)
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Failed to download dataset: {e}")
        sys.exit(1)

    problems = []
    seen_slugs = set()
    processed = 0

    print(f"   Streaming and processing up to {args.count} problems...")
    
    for line in response.iter_lines():
        if processed >= args.count:
            break
        
        if line:
            sample = json.loads(line.decode('utf-8'))
            problem = process_sample(sample)
            
            if problem:
                # Deduplicate slug
                if problem['slug'] in seen_slugs:
                    problem['slug'] = f"{problem['slug']}-{processed}"
                seen_slugs.add(problem['slug'])
                
                problems.append(problem)
                processed += 1
                
                if processed % 50 == 0:
                    print(f"   Processed {processed}/{args.count}...")

    # Ensure output directory exists
    output_dir = os.path.dirname(args.output)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(problems, f, ensure_ascii=False, indent=2)

    by_diff = {'Easy': 0, 'Medium': 0, 'Hard': 0}
    for p in problems:
        by_diff[p['difficulty']] = by_diff.get(p['difficulty'], 0) + 1

    print(f"\n✅ Done! Saved {len(problems)} problems to '{args.output}'")
    print(f"   Easy: {by_diff['Easy']}  |  Medium: {by_diff['Medium']}  |  Hard: {by_diff['Hard']}")
    print(f"\nNext step: run the importer:")
    print(f"   cd ThinkDSA/apps/api && npx ts-node ../../scripts/import_apps.ts")

if __name__ == '__main__':
    main()
