import { UniqueEntityId } from "./unique-entity-id"


export abstract class EntityBase<Props> {
    private _id: UniqueEntityId
    protected props: Props

    get id() {
        return this._id
    }

    constructor(props: Props, id?: UniqueEntityId) {
        this.props = props
        this._id = id ?? new UniqueEntityId()
    }

    public equals(entity: EntityBase<unknown>) {
        if (entity === this) {
            return true
          }
      
          if (entity.id === this._id) {
            return true
          }
      
          return false
    }
}