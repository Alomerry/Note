package copier

import (
	"errors"
	"reflect"
)

func init() {

}

func Copy(toValue interface{}, fromValue interface{}, resetFieldMethods map[string]interface{}, diffFields map[string]string) error {
	var (
		from    = indirect(reflect.ValueOf(fromValue))
		to      = indirect(reflect.ValueOf(toValue))
	)

	if !to.CanAddr() {
		return errors.New("copy to value is unaddressable")
	}

	// Return is from value is invalid
	if !from.IsValid() {
		return nil
	}

	fromType := indirectType(from.Type())
	toType := indirectType(to.Type())

	// Just set it if possible to assign
	// And need to do copy anyway if the type is struct
	if fromType.Kind() != reflect.Struct && from.Type().AssignableTo(to.Type()) {
		to.Set(from)
		return nil
	}

	for i := 0; i < fromType.NumField(); i++ {
		originField := fromType.Field(i)
		fieldName := originField.Name
		value := from.Field(i)
		if method, ok := resetFieldMethods[fieldName]; ok {
			f := reflect.ValueOf(method)
			result := f.Call(
				[]reflect.Value{value},
			)
			value = result[0]
		}

		if newFiledName, ok := diffFields[fieldName]; ok {
			fieldName = newFiledName
		}

		if targetField, ok := toType.FieldByName(fieldName); ok {
			if len(converters) > 0 {
				_, hasResetFieldMethod := resetFieldMethods[fieldName]

				if !hasResetFieldMethod {
					if targetField.Type != value.Type() {
						for _, convert := range converters {
							value = convert(value)
						}
					}
				}
			}

			if value.Type().ConvertibleTo(targetField.Type) {
				value = value.Convert(targetField.Type)
				to.FieldByName(fieldName).Set(value)
			}
		}
	}
}

func indirect(reflectValue reflect.Value) reflect.Value {
	for reflectValue.Kind() == reflect.Ptr {
		reflectValue = reflectValue.Elem()
	}
	return reflectValue
}

func indirectType(reflectType reflect.Type) reflect.Type {
	for reflectType.Kind() == reflect.Ptr || reflectType.Kind() == reflect.Slice {
		reflectType = reflectType.Elem()
	}
	return reflectType
}
