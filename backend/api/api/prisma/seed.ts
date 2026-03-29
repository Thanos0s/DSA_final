import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const problems = [
        {
            title: 'Two Sum',
            slug: 'two-sum',
            statement: '# Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.\n\nYou can return the answer in any order.\n\n## Example 1:\n\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n```',
            difficulty: 'Easy',
            topic: 'Arrays',
            metadata: JSON.stringify({
                concepts: ['HashTable', 'Array'],
                hints: ['Try using a hash map to store visited numbers.']
            }),
            testCases: JSON.stringify([
                { input: 'nums=[2,7,11,15], target=9', output: '[0,1]' }
            ]),
        },
        {
            title: 'Valid Palindrome',
            slug: 'valid-palindrome',
            statement: '# Valid Palindrome\n\nA phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a **palindrome**, or `false` otherwise.\n\n## Example 1:\n\n```\nInput: s = "A man, a plan, a canal: Panama"\nOutput: true\nExplanation: "amanaplanacanalpanama" is a palindrome.\n```',
            difficulty: 'Easy',
            topic: 'Strings',
            metadata: JSON.stringify({
                concepts: ['Two Pointers', 'String'],
                hints: ['Consider using two pointers, one at the start and one at the end.']
            }),
            testCases: JSON.stringify([
                { input: 's="A man, a plan, a canal: Panama"', output: 'true' }
            ]),
        },
        {
            title: 'Longest Substring Without Repeating Characters',
            slug: 'longest-substring-without-repeating',
            statement: '# Longest Substring Without Repeating Characters\n\nGiven a string `s`, find the length of the **longest substring** without repeating characters.\n\n## Example 1:\n\n```\nInput: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.\n```\n\n## Constraints:\n- 0 <= s.length <= 5 * 10^4',
            difficulty: 'Medium',
            topic: 'Sliding Window',
            metadata: JSON.stringify({
                concepts: ['Sliding Window', 'HashSet', 'String'],
                hints: ['Use a sliding window with a set to track unique characters.']
            }),
            testCases: JSON.stringify([
                { input: 's="abcabcbb"', output: '3' }
            ]),
        },
        {
            title: 'Trapping Rain Water',
            slug: 'trapping-rain-water',
            statement: '# Trapping Rain Water\n\nGiven `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\n## Example:\n\n```\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\n```\n\n## Constraints:\n- 1 <= n <= 2 * 10^4\n- 0 <= height[i] <= 10^5',
            difficulty: 'Hard',
            topic: 'Two Pointers',
            metadata: JSON.stringify({
                concepts: ['Two Pointers', 'Dynamic Programming', 'Stack'],
                hints: ['Consider the max height from left and right for each position.']
            }),
            testCases: JSON.stringify([
                { input: 'height=[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }
            ]),
        }
    ];

    for (const p of problems) {
        await prisma.problem.upsert({
            where: { slug: p.slug },
            update: {},
            create: p,
        });
    }

    console.log('Seed data inserted');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
