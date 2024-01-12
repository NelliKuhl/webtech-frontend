import { describe, it, expect, vi } from 'vitest'

import { mount, shallowMount, flushPromises } from '@vue/test-utils'
import DynamicList from '@/components/DynamicList.vue'
import type { List, Zutat } from '@/types'
import axios from 'axios'
import { ref } from 'vue'




describe('DynamicList', () => {
  const $auth = ref({ isAuthenticated: true })
  const email = "email@test.de"
  const emptyResponse: Zutat[] = []
  const twoItemResponse: Zutat[] = [
    { id: 1, zutat: 'Apfel', menge: 42, einheit: 'kg'},
    { id: 2, zutat: 'Milch', menge: 13, einheit: 'Stück'}]
  const oneItemResponse: Zutat[] = [
    { id: 1, zutat: 'Apfel', menge: 42, einheit: 'kg'}
  ]
  const emptylist: List[] = []
  const filledlist: List[] = [
    { id: 1, name: 'Einkaufsliste', owner: email},
    { id: 2, name: 'Einkaufsliste', owner: email}
  ]

  vi.mock('axios')
  vi.mock('@okta/okta-vue', () => {
    return { useAuth: () => ({ getUser: vi.fn() })}
  });

  /**
   * Testet, ob eine Nachricht angezeigt wird, wenn keine Items vom Backend empfangen werden.
   */
  it('should display message when no items are received from backend', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: emptyResponse})

    const wrapper = mount(DynamicList)

    await flushPromises()

    expect(wrapper.text()).toContain('Liste Leer')
  })
    /**
   * Testet, ob die Komponente gelöscht wird.
   */

})