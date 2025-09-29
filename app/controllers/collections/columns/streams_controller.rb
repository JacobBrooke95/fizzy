class Collections::Columns::StreamsController < ApplicationController
  include CollectionScoped

  def show
    set_page_and_extract_portion_from @collection.cards.awaiting_triage.reverse_chronologically
    fresh_when etag: [ @collection, @page.records ]
  end
end
