import { describe, it, expect, vi } from 'vitest'

import { mount, shallowMount, flushPromises } from '@vue/test-utils'
import DynamicList from '@/components/DynamicList.vue'
import type {Zutat} from '@/types'
import axios from 'axios'
import { ref } from 'vue'




describe('DynamicList', () => {
  const $auth = ref({ isAuthenticated: true })
  const email = "email@test.de"
  const emptyResponse: Zutat[] = []
  const twoItemResponse: Zutat[] = [
    { id: 1, zutat: 'Apfel', menge: 42, einheit: 'kg', owner: 'Nelli' },
    { id: 2, zutat: 'Milch', menge: 13, einheit: 'Stück', owner: 'Nelli' }]
  const oneItemResponse: Zutat[] = [
    { id: 1, zutat: 'Apfel', menge: 42, einheit: 'kg', owner: 'Nelli' }
  ]

  vi.mock('axios')
  /**
   * Testet, ob die Komponente gerendert wird.
   */
  it('should render the items from the backend', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: twoItemResponse, email, $auth })

    const item = twoItemResponse[0].zutat
    const title = 'This is a title!'
    const wrapper = shallowMount(DynamicList, {

      props: { title }
    })
    expect(wrapper.text()).toMatch(title)

  })
  /**
   * Testet, ob eine Nachricht angezeigt wird, wenn keine Items vom Backend empfangen werden.
   */
  it('should render message when no items received from backend', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: emptyResponse, email, $auth })

    const wrapper = shallowMount(DynamicList)
    const msg = 'Liste leer'
    await flushPromises()

    expect(wrapper.text()).toContain(msg)
  })
  /**
   * Testet, ob Liste automatisch aktualisiert wird.
   */
  it('should update list automatically', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: oneItemResponse, email, $auth })

    const wrapper = mount(DynamicList)

    await flushPromises()

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: twoItemResponse, email, $auth })

    await flushPromises()

    expect(wrapper.text()).toContain(twoItemResponse[0].zutat)
  })
  /**
   * Testet, ob die Komponente gelöscht wird.
   */
})