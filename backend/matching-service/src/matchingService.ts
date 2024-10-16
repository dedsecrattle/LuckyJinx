interface MatchingRequest {
  userId: string;
  topic: string;
  difficulty: string;
  resolve: (result: { success: boolean; message: string }) => void;
  timeoutId: NodeJS.Timeout; // For canceling the timeout if matched
}

let matchingPool: MatchingRequest[] = [];

export async function startMatching(
  userId: string,
  topic: string,
  difficulty: string
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
      const newRequest: MatchingRequest = {
          userId,
          topic,
          difficulty,
          resolve,
          timeoutId: setTimeout(() => {
              // Remove the request from the pool after 30 seconds if no match is found
              matchingPool = matchingPool.filter((req) => req.userId !== userId);
              console.log(`No match found for ${userId} after 30 seconds. Removing from pool.`);
              resolve({ success: false, message: 'Failed to find a match after 30 seconds.' });
          }, 30000), // 30-second timeout
      };

      // Check if there is a match in the pool
      const matchIndex = matchingPool.findIndex(
          (req) => req.topic === topic && req.difficulty === difficulty && req.userId !== userId
      );

      if (matchIndex !== -1) {
          // Match found, resolve both users and clear their timeouts
          const matchedRequest = matchingPool[matchIndex];

          // Remove matched request from the pool
          matchingPool = matchingPool.filter((req) => req.userId !== matchedRequest.userId);

          // Clear both users' timeouts
          clearTimeout(matchedRequest.timeoutId);
          clearTimeout(newRequest.timeoutId);

          console.log(`Matched ${userId} with ${matchedRequest.userId} on topic ${topic}, difficulty ${difficulty}`);
          
          // Notify both users of successful match
          matchedRequest.resolve({ success: true, message: `Matched with user ${userId}` });
          resolve({ success: true, message: `Matched with user ${matchedRequest.userId}` });
      } else {
          // No match yet, add to the pool
          matchingPool.push(newRequest);
          console.log(`Added ${userId} to the pool. Waiting for a match...`);
      }
  });
}
