class Collections::Columns::NotNowsController < ApplicationController
  include CollectionScoped

  def show
    set_page_and_extract_portion_from @collection.cards.postponed.reverse_chronologically
    fresh_when etag: [ @collection, @page.records ]
  end
end
