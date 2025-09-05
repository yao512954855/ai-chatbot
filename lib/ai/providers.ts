import { createOpenAICompatible  } from '@ai-sdk/openai-compatible';

import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { gateway } from '@ai-sdk/gateway';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// 创建 Ollama 兼容适配器实例
const ollama = createOpenAICompatible({
  name: 'ollama', // 自定义名称
  baseURL: 'http://localhost:11434/v1', // Ollama 的 OpenAI 兼容接口地址
  // 无需 API 密钥（本地 Ollama 通常不需要）
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': gateway.languageModel('xai/grok-2-vision-1212'),
        'chat-model-reasoning': wrapLanguageModel({
          model: gateway.languageModel('xai/grok-3-mini-beta'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': gateway.languageModel('xai/grok-2-1212'),
        'artifact-model': gateway.languageModel('xai/grok-2-1212'),

        'qwen3': ollama.languageModel('qwen3'), // 模型 ID 需与本地 Ollama 中拉取的一致
      },
    });
