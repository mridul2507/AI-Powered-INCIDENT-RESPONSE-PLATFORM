import os from 'os'
import { prisma } from '@/lib/prisma'

export async function collectAndStoreMetrics() {
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const memoryUsage = parseFloat((((totalMem - freeMem) / totalMem) * 100).toFixed(2))

  const cpuUsage = await getCpuUsagePercent()

  const services = await prisma.service.findMany({
    select: { id: true, organizationId: true }
  })

  await Promise.all(
    services.map(service =>
      prisma.metric.create({
        data: {
          serviceId: service.id,
          organizationId: service.organizationId,
          cpuUsage,
          memoryUsage,
        }
      })
    )
  )
}

function getCpuUsagePercent(): Promise<number> {
  return new Promise(resolve => {
    const start = process.cpuUsage()
    setTimeout(() => {
      const end = process.cpuUsage(start)
      const total = (end.user + end.system) / 1000
      resolve(parseFloat(Math.min(total / 100, 100).toFixed(2)))
    }, 100)
  })
}