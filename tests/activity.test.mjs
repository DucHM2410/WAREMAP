import test from 'node:test'
import assert from 'node:assert/strict'
import { activityId } from '../src/app/activity.ts'

test('activity logging works when randomUUID is missing or blocked', () => {
  const missing = {}
  const blocked = { randomUUID() { throw new Error('Unavailable in this context') } }
  const ids = Array.from({ length: 100 }, (_, i) => activityId(i % 2 ? missing : blocked))
  assert.equal(new Set(ids).size, 100)
  assert.ok(ids.every(id => id.startsWith('activity-')))
})

test('activity logging uses native UUID when available', () => {
  assert.equal(activityId({ randomUUID: () => 'native-uuid' }), 'native-uuid')
})
