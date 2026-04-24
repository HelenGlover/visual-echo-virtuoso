// Simple word-level diff between two texts (Myers-style LCS).
// Returns an array of segments tagged as 'same' | 'add' | 'remove'.
export type DiffSeg = { type: "same" | "add" | "remove"; text: string };

function tokenize(s: string): string[] {
  // Split keeping whitespace so we can rebuild faithfully.
  return s.split(/(\s+)/).filter((t) => t.length > 0);
}

export function diffWords(a: string, b: string): DiffSeg[] {
  const A = tokenize(a);
  const B = tokenize(b);
  const n = A.length;
  const m = B.length;

  // LCS DP table
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (A[i] === B[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: DiffSeg[] = [];
  let i = 0;
  let j = 0;
  function push(type: DiffSeg["type"], text: string) {
    const last = out[out.length - 1];
    if (last && last.type === type) last.text += text;
    else out.push({ type, text });
  }
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      push("same", A[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push("remove", A[i]);
      i++;
    } else {
      push("add", B[j]);
      j++;
    }
  }
  while (i < n) {
    push("remove", A[i++]);
  }
  while (j < m) {
    push("add", B[j++]);
  }
  return out;
}
