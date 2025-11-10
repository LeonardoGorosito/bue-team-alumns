export function ensureDemoData() {
  const coursesKey = 'demo:courses'
  const ordersKey = 'demo:orders'

  if (!localStorage.getItem(coursesKey)) {
    const courses = [
      { id: 'c1', slug: 'fansly-master', title: 'Fansly Master', price: 85000, currency: 'ARS' },
      { id: 'c2', slug: 'fetichista-master', title: 'Fetichista Master', price: 120000, currency: 'ARS' },
    ]
    localStorage.setItem(coursesKey, JSON.stringify(courses))
  }

  if (!localStorage.getItem(ordersKey)) {
    const orders = [
      { id: 'o1', userId: 'u-ana', buyerName: 'Ana', buyerEmail: 'ana@demo.test', courseId: 'c1', status: 'PAID', source: 'MANUAL', createdAt: new Date().toISOString() },
    ]
    localStorage.setItem(ordersKey, JSON.stringify(orders))
  }
}

export function getDemoCourses(){ return JSON.parse(localStorage.getItem('demo:courses') || '[]') }
export function getDemoOrders(){ return JSON.parse(localStorage.getItem('demo:orders') || '[]') }
export function addDemoOrder(order:any){
  const arr = getDemoOrders(); arr.push(order); localStorage.setItem('demo:orders', JSON.stringify(arr))
}
