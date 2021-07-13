module.exports = {
  content: [
    ['rls', {
      page: 'states/_state',
      permalink: 'states/:slug',
      isPost: false,
      generate: [
        'get',
        'getAll'
      ]
    }],
    ['en/pages', {
      page: '/_page',
      permalink: ':slug',
      anchorLevel: 1,
      isPost: false,
      generate: [
        'get',
        'getAll'
      ]
    }],
    ['en/faqs', {
      page: 'faqs/_slug',
      permalink: 'faqs/:slug',
      isPost: false,
      generate: [
        'get',
        'getAll'
      ]
    }],
    ['es/pages', {
      page: '/_page',
      permalink: 'es/:slug',
      isPost: false,
      generate: [
        'get',
        'getAll'
      ]
    }],
    ['es/faqs', {
      page: 'faqs/_slug',
      permalink: 'es/faqs/:slug',
      isPost: false,
      generate: [
        'get',
        'getAll'
      ]
    }],
    ['elections', {
      page: '/elections/_state',
      isPost: false,
      generate: [
        'get',
        'getAll'
      ]
    }]
    // ,[
    //   'leos',
    //   {
    //     page: 'leos/_state',
    //     permalink: 'leos/:slug',
    //     isPost: false,
    //     generate: [
    //       'get'
    //     ]
    //   }
    // ]
  ],
  api: function (isStatic) {
    let url = process.env.baseUrl
    return {
      browserBaseURL: isStatic ? url : ''
    }
  }
}
