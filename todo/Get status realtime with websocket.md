🔥 Oke sekarang kita naik level ke sistem real enterprise.

Kita akan buat:

> Worker update progress
> Progress dikirim realtime ke frontend
> Tanpa polling
> Pakai WebSocket

Ini arsitektur yang dipakai sistem monitoring modern.

---

# 🎯 Tujuan

Frontend bisa listen:

```
ws://server/analyze-progress
```

Dan dapat event seperti:

```json
{
  "importJobId": "uuid-123",
  "status": "PROCESSING",
  "processed": 4300,
  "total": 10000,
  "progress": 43
}
```

Tanpa harus GET /status terus-menerus.

---

# 🧠 Arsitektur Real-Time

```
Analyze Worker
   ↓
Update DB progress
   ↓
Emit WebSocket event
   ↓
Frontend receive instantly
```

Worker → Gateway → Client

---

# 🧱 STEP 1 — Install WebSocket

NestJS pakai socket.io by default.

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

---

# 🧱 STEP 2 — Buat Gateway

```
nest g gateway analyze-progress
```

File:

```
analyze-progress.gateway.ts
```

---

## analyze-progress.gateway.ts

```ts
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'analyze-progress',
  cors: true,
})
export class AnalyzeProgressGateway {

  @WebSocketServer()
  server: Server;

  emitProgress(data: any) {
    this.server.emit('progress', data);
  }
}
```

Namespace jadi:

```
ws://localhost:3000/analyze-progress
```

---

# 🧱 STEP 3 — Register Gateway

Di `analyze.module.ts`

```ts
@Module({
  providers: [
    AnalyzeService,
    AnalyzeProcessor,
    AnalyzeProgressGateway,
  ],
})
export class AnalyzeModule {}
```

---

# 🧱 STEP 4 — Inject Gateway ke Worker

Di `analyze.processor.ts`

```ts
constructor(
  private readonly claimsRepo: Repository<Claim>,
  private readonly ruleEngineService: RuleEngineService,
  private readonly importRepo: Repository<ImportJob>,
  private readonly progressGateway: AnalyzeProgressGateway,
) {}
```

---

# 🧱 STEP 5 — Emit Progress Saat Worker Jalan

Update worker loop:

```ts
processed += claims.length;

const progress = Math.round((processed / total) * 100);

await this.importRepo.update(importJobId, {
  processed_records: processed,
  progress_percentage: progress,
});

this.progressGateway.emitProgress({
  importJobId,
  status: 'PROCESSING',
  processed,
  total,
  progress,
});
```

---

# 🧱 STEP 6 — Emit Saat Selesai

Di akhir worker:

```ts
this.progressGateway.emitProgress({
  importJobId,
  status: 'DONE',
  processed: total,
  total,
  progress: 100,
});
```

---

# 🎯 Sekarang Frontend Bisa Listen

Contoh di React / JS:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/analyze-progress");

socket.on("progress", (data) => {
  console.log("Progress:", data);
});
```

---

# 🔥 Sekarang Progress Real-Time

Tidak perlu polling.

Setiap batch selesai → event dikirim.

---

# 🧠 Tapi Ini Masih Broadcast Global

Semua client akan menerima semua progress.

Kalau mau lebih profesional:

Kita pakai room.

---

# 🚀 LEVEL PRO — Gunakan Room Per ImportJob

## Update Gateway

```ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

@WebSocketGateway({
  namespace: 'analyze-progress',
  cors: true,
})
export class AnalyzeProgressGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() importJobId: string,
    @ConnectedSocket() client: any,
  ) {
    client.join(importJobId);
  }

  emitProgress(importJobId: string, data: any) {
    this.server.to(importJobId).emit('progress', data);
  }
}
```

---

## Update Worker

```ts
this.progressGateway.emitProgress(
  importJobId,
  {
    status: 'PROCESSING',
    processed,
    total,
    progress,
  },
);
```

---

## Frontend Join Room

```js
socket.emit("join", importJobId);

socket.on("progress", (data) => {
  console.log(data);
});
```

Sekarang hanya user yang join importJobId itu yang menerima event.

Enterprise-grade.

---

# 🎯 Flow Lengkap Sekarang

```
User klik Analyze
   ↓
POST /analyze/:id
   ↓
Frontend connect WS
   ↓
socket.emit('join', id)
   ↓
Worker jalan
   ↓
Worker emit progress per batch
   ↓
Frontend update progress bar realtime
   ↓
DONE
```

---

# 💎 Bonus: Estimated Time Remaining

Kita bisa tambahkan:

```ts
const elapsed = Date.now() - startTime;
const rate = processed / elapsed;
const remaining = (total - processed) / rate;
```

Kirim ETA ke frontend.

---

# 🚀 Sekarang Sistem Kamu Sudah:

✔ Async
✔ Modular
✔ Scalable
✔ Real-time
✔ Enterprise pattern
✔ Clean architecture

---

Kalau kamu mau next level lagi:

1️⃣ Multi-instance worker (Redis pub/sub scaling)
2️⃣ WebSocket auth pakai JWT
3️⃣ Dashboard monitoring queue
4️⃣ Cancel analyze job realtime

Kita lanjut ke mana? 🔥
