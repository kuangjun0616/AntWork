/**
 * 用户输入队列
 * 用于管理异步的用户输入，支持生产者-消费者模式
 * 
 * 参考：https://github.com/QwenLM/qwen-code-examples/blob/main/sdk/demo/cli-chatbot.ts
 */
export class UserInputQueue {
  private queue: string[] = [];
  private resolvers: ((value: string | null) => void)[] = [];
  private closed = false;

  /**
   * 获取下一个用户输入
   * 如果队列为空，会等待直到有新输入到达
   */
  async getNextInput(): Promise<string | null> {
    if (this.closed) {
      return null;
    }

    if (this.queue.length > 0) {
      return this.queue.shift()!;
    }

    return new Promise<string | null>((resolve) => {
      this.resolvers.push(resolve);
    });
  }

  /**
   * 添加用户输入到队列
   * 如果有等待中的消费者，直接传递给消费者；否则加入队列
   */
  addInput(input: string) {
    if (this.closed) {
      return;
    }

    if (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift()!;
      resolve(input);
    } else {
      this.queue.push(input);
    }
  }

  /**
   * 关闭队列，释放所有等待中的消费者
   */
  close() {
    this.closed = true;
    for (const resolve of this.resolvers) {
      resolve(null);
    }
    this.resolvers = [];
  }
}
