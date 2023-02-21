module.exports = {
  eq: function (a, b) {
    if (a === b) {
      return true
    }
    return false
  },
  lesse: function (a, b) {
    if (a <= b) {
      return true
    }
    return false
  },
  grte: function (a, b) {
    if (a >= b) {
      return true
    }
    return false
  },
  into: function (a, b) {
    if (a * b) {
      return a * b
    }
  },
  logand: function (a, b) {
    if (a && b) {
      return a && b
    }
  },
  abcAnd: function (a, b, c) {
    if (a && b && c) {
      return a && b && c
    }
  },
  JSON: function (context) {
    return JSON.stringify(context)
  },
  paginate: function (currentPage, totalPages) {
    const pagesToShow = 5
    const pages = []
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1)

    // Add page numbers to the array
    for (let i = startPage; i <= endPage; i++) {
      pages.push({ number: i, isActive: i === currentPage })
    }

    return pages
  }
}
